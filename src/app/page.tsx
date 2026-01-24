export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Nolen Young</h1>
        <p className="text-zinc-500 font-mono">SDE2 @ Amazon | Site in development</p>
        <div className="mt-8 px-4 py-2 border border-zinc-800 text-zinc-400 text-sm">
          Site status: <span className="text-green-500">Publicly Accessible</span>
        </div>
      </div>
    </main>
  );
}
