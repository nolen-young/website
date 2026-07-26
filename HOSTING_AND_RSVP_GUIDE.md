# 💒 Wedding Subsite & RSVP Backend Setup Guide
**For Nolen & Syrel's Wedding Website**

This document provides a comprehensive guide on how the RSVP system works, along with exact, step-by-step setup instructions for each hosting & backend proposal so you can choose the best operating model for your wedding.

---

## 📌 Executive Summary

We have created a personal wedding subsite at `/wedding` and an interactive RSVP portal at `/wedding/rsvp` (plus an Admin Dashboard at `/wedding/admin`).

### How the Local Demo Works Right Now:
- The website is built with **Next.js App Router** configured for static export (`output: 'export'`).
- Currently, client-side state is handled by `src/lib/rsvpService.ts`, which uses browser `localStorage` as a fallback.
- **Admin Passcode**: Protected by a PIN security screen on `/wedding/admin` (default passcode: `2027`, configurable via `NEXT_PUBLIC_ADMIN_PASSCODE`).

---

## 🛠️ Proposal 1: Google Sheets Webhook (Recommended • $0/month)

### Why This Is the Best Option:
- **100% Free Forever**: Zero hosting or database costs.
- **Best Couple Experience**: Nolen and Syrel can view, add guests, and monitor RSVPs live in a Google Sheet from their phones or laptops without needing SQL or database admin tools.
- **Easy Mail Invite Import**: Copy & paste guest lists directly from Excel/Google Sheets.

### Step-by-Step Implementation:

#### 1. Create the Google Sheet
1. Create a new Google Sheet named **Nolen & Syrel Wedding RSVPs**.
2. Name the first tab **`Guests`** and create the following headers in Row 1:
   ```
   Code | FirstName | LastName | Email | AllowedPlusOne | Status | Attending | Entree | DietaryNotes | PlusOneAttending | PlusOneFirstName | PlusOneLastName | PlusOneEntree | PlusOneDietary | Note | UpdatedAt
   ```
3. Add your guest list below Row 1 (e.g. `NOLEN-SYREL-001 | Alex | Rivers | alex@example.com | TRUE | Pending | ...`).

#### 2. Add Google Apps Script Webhook
1. In your Google Sheet, click **Extensions** &rarr; **Apps Script**.
2. Replace all code in `Code.gs` with the following paste-ready script:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Guests");
    const rows = sheet.getDataRange().getValues();
    
    const guestCode = data.code ? data.code.trim().toUpperCase() : "";
    const guestId = data.id || "";
    
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0].toString().toUpperCase() === guestCode || rows[i][0].toString() === guestId) {
        rowIndex = i + 1; // 1-indexed row number
        break;
      }
    }
    
    if (rowIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Guest code not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Update RSVP response columns
    sheet.getRange(rowIndex, 6).setValue("Responded"); // Status
    sheet.getRange(rowIndex, 7).setValue(data.attending ? "Yes" : "No"); // Attending
    sheet.getRange(rowIndex, 8).setValue(data.mealPreference || ""); // Entree
    sheet.getRange(rowIndex, 9).setValue(data.dietaryRestrictions || ""); // DietaryNotes
    
    if (data.plusOne) {
      sheet.getRange(rowIndex, 10).setValue(data.plusOne.attending ? "Yes" : "No");
      sheet.getRange(rowIndex, 11).setValue(data.plusOne.firstName || "");
      sheet.getRange(rowIndex, 12).setValue(data.plusOne.lastName || "");
      sheet.getRange(rowIndex, 13).setValue(data.plusOne.mealPreference || "");
      sheet.getRange(rowIndex, 14).setValue(data.plusOne.dietaryRestrictions || "");
    }
    
    sheet.getRange(rowIndex, 15).setValue(data.message || ""); // Note
    sheet.getRange(rowIndex, 16).setValue(new Date().toISOString()); // UpdatedAt
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### 3. Deploy the Web App
1. Click **Deploy** &rarr; **New deployment**.
2. Select type: **Web app**.
3. **Execute as**: `Me (your-email@gmail.com)`.
4. **Who has access**: `Anyone`.
5. Click **Deploy**, authorize permissions, and copy the **Web App URL** (e.g., `https://script.google.com/macros/s/.../exec`).

#### 4. Connect to Cloudflare Pages
In Cloudflare Pages dashboard &rarr; Settings &rarr; Environment Variables:
- `NEXT_PUBLIC_RSVP_WEBHOOK_URL` = `https://script.google.com/macros/s/.../exec`
- `NEXT_PUBLIC_ADMIN_PASSCODE` = `your-secret-pin`

---

## 🛠️ Proposal 2: Cloudflare Pages + Cloudflare D1 (Serverless SQLite • $0/month)

### Overview:
Cloudflare D1 is a serverless SQL database natively integrated into Cloudflare Pages.

### Step-by-Step Implementation:

#### 1. Create Cloudflare D1 Database
In your terminal (using Wrangler CLI):
```bash
npx wrangler d1 create wedding-rsvps
```

#### 2. Define SQL Schema (`schema.sql`)
```sql
CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  allowed_plus_one INTEGER DEFAULT 0,
  rsvp_submitted INTEGER DEFAULT 0,
  attending INTEGER,
  meal_preference TEXT,
  dietary_restrictions TEXT,
  plus_one_attending INTEGER,
  plus_one_first_name TEXT,
  plus_one_last_name TEXT,
  plus_one_meal_preference TEXT,
  plus_one_dietary_restrictions TEXT,
  message TEXT,
  updated_at TEXT
);
```

Execute schema against D1:
```bash
npx wrangler d1 execute wedding-rsvps --file=./schema.sql
```

#### 3. Create Cloudflare Pages Function (`functions/api/rsvp.ts`)
```typescript
interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const data = await context.request.json();
  const db = context.env.DB;

  await db.prepare(`
    UPDATE guests SET
      rsvp_submitted = 1,
      attending = ?,
      meal_preference = ?,
      dietary_restrictions = ?,
      plus_one_attending = ?,
      plus_one_first_name = ?,
      plus_one_last_name = ?,
      plus_one_meal_preference = ?,
      plus_one_dietary_restrictions = ?,
      message = ?,
      updated_at = datetime('now')
    WHERE code = ? OR id = ?
  `).bind(
    data.attending ? 1 : 0,
    data.mealPreference || null,
    data.dietaryRestrictions || null,
    data.plusOne?.attending ? 1 : 0,
    data.plusOne?.firstName || null,
    data.plusOne?.lastName || null,
    data.plusOne?.mealPreference || null,
    data.plusOne?.dietaryRestrictions || null,
    data.message || null,
    data.code,
    data.id
  ).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
};
```

#### 4. Bind D1 to Cloudflare Pages
In Cloudflare Dashboard &rarr; Workers & Pages &rarr; Your Project &rarr; Settings &rarr; Functions &rarr; **D1 database bindings**:
- Variable name: `DB`
- D1 database: `wedding-rsvps`

---

## 🛠️ Proposal 3: Azure Static Web Apps + Azure Table Storage (Microsoft Perks)

### Overview:
Leverages your Microsoft employee Azure credits ($150/mo credit) using Azure Static Web Apps (SWA) with managed Azure Functions and Azure Table Storage NoSQL.

### Step-by-Step Implementation:

#### 1. Create Azure Storage Account
1. Open the [Azure Portal](https://portal.azure.com).
2. Create a **Storage Account** resource (e.g. `nolenweddingstorage`).
3. Under Data Storage &rarr; Tables, create a table named `rsvps`.
4. Copy the **Connection String** from Access Keys.

#### 2. Azure Function Endpoint (`api/rsvp/index.ts`)
```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TableClient } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const client = TableClient.fromConnectionString(connectionString, "rsvps");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const data = req.body;
  const entity = {
    partitionKey: "Wedding2027",
    rowKey: data.code.toUpperCase(),
    attending: data.attending,
    mealPreference: data.mealPreference || "",
    dietaryRestrictions: data.dietaryRestrictions || "",
    plusOneFirstName: data.plusOne?.firstName || "",
    plusOneLastName: data.plusOne?.lastName || "",
    plusOneMeal: data.plusOne?.mealPreference || "",
    message: data.message || "",
    updatedAt: new Date().toISOString()
  };

  await client.upsertEntity(entity, "Replace");

  context.res = {
    status: 200,
    body: { success: true }
  };
};

export default httpTrigger;
```

#### 3. Configure Azure SWA Environment Variable
In Azure Portal &rarr; Static Web Apps &rarr; Configuration &rarr; Application settings:
- `AZURE_STORAGE_CONNECTION_STRING` = `[Your Connection String]`
- `NEXT_PUBLIC_ADMIN_PASSCODE` = `[Your PIN]`

---

## 🔒 Security Architecture & Admin Passcode Proposals

### ⚠️ Client-Side vs. Server-Side Security Analysis
In Next.js, environment variables prefixed with `NEXT_PUBLIC_` (such as `NEXT_PUBLIC_ADMIN_PASSCODE`) are baked directly into the static JavaScript bundles sent to the client browser at build time.

- **Soft Barrier (Current Setup)**: Client-side PIN validation (`if (input === passcode)`) stops casual wedding guests from viewing `/wedding/admin`.
- **Bundle Visibility**: However, a technical user or bot inspecting the site's compiled JavaScript files can grep/search for the passcode string inside the bundle.

---

### 🛡️ 3 Proposals for 100% Zero-Trust Admin Security

To completely eliminate passcode exposure from JavaScript bundles, choose one of the following 3 security models:

#### Proposal A: Serverless Function PIN Verification (Server-Side)
- **How it works**:
  1. Remove the `NEXT_PUBLIC_` prefix and rename the environment variable to `ADMIN_PASSCODE` in your hosting dashboard.
  2. Create a serverless function endpoint (e.g. `functions/api/admin-login.ts` on Cloudflare Pages or `/api/admin-login` on Next.js server):
     ```typescript
     export const onRequestPost: PagesFunction<{ ADMIN_PASSCODE: string }> = async (context) => {
       const { passcode } = await context.request.json();
       if (passcode === context.env.ADMIN_PASSCODE) {
         return new Response(JSON.stringify({ success: true, token: "SECURE_SESSION_TOKEN" }), {
           headers: { "Content-Type": "application/json" }
         });
       }
       return new Response(JSON.stringify({ success: false, error: "Invalid passcode" }), { status: 401 });
     };
     ```
  3. The client-side dashboard sends a POST request with the entered PIN. The real passcode is stored **only on the server** and is never exposed in client JS bundles.

#### Proposal B: Google Apps Script Backend Auth (Integrated with Proposal 1)
- **How it works**:
  1. When using the Google Sheets backend (Proposal 1), the admin PIN check occurs inside `Code.gs` on Google's private servers.
  2. The website frontend submits the entered PIN over HTTPS to the Google Apps Script endpoint.
  3. Google Apps Script checks the PIN against your private Google Sheet setting and returns the authorized guest list.
  4. **Result**: Zero passcode reference in client JS bundles.

#### Proposal C: Cloudflare Access / Edge Protection ($0/month)
- **How it works**:
  1. In Cloudflare Dashboard &rarr; **Zero Trust** &rarr; **Access** &rarr; **Applications**, create an Access Application for path `yourdomain.com/wedding/admin`.
  2. Set an access policy (e.g., require One-Time PIN sent to `nolen@example.com` or require a master password).
  3. Cloudflare intercepts all requests to `/wedding/admin` **at the edge before serving any HTML or JS**.
  4. **Result**: Unauthenticated users or bots cannot even load the `/wedding/admin` page.

---

## 📋 Operational Guide: Guest List Management

### How to Print Personal Invitation Links & QR Codes
Each guest on your guest list has a unique code (e.g., `NOLEN-SYREL-001`).

You can generate individual personalized invitation URLs for your mail invitations:
- **Format**: `https://your-website.com/wedding/rsvp?code=NOLEN-SYREL-001`
- **QR Code**: Paste this URL into any QR code generator (e.g. Canva or QR Code Generator) to print directly on physical paper invitations!

### How Guests Experience RSVP
1. **QR / Custom Link**: Opening their invitation QR code automatically identifies the guest and pre-fills their name and +1 status.
2. **Manual Website Search**: Guests can also visit `/wedding/rsvp` directly, type their name, and select their matching invitation.

