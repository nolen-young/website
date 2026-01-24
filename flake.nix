{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      # Define the libraries the Next.js compiler needs
      libPath = with pkgs; lib.makeLibraryPath [
        stdenv.cc.cc.lib
        zlib
      ];
    in {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [ 
          pkgs.nodejs_22 
          pkgs.nodePackages.npm 
        ];

        shellHook = ''
          # This allows the SWC binary to find its required libraries
          export LD_LIBRARY_PATH="${libPath}:$LD_LIBRARY_PATH"
          echo "Next.js dev environment loaded with NixOS binary fixes."
        '';
      };
    };
}
