{
  description = "Nolen & Syrel Personal Website and Wedding Subsite";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
          libPath = pkgs.lib.makeLibraryPath (with pkgs; [
            stdenv.cc.cc.lib
            zlib
          ]);
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs_22
              nodePackages.npm
              git
            ];

            shellHook = ''
              export LD_LIBRARY_PATH="${libPath}:''${LD_LIBRARY_PATH:-}"
              echo "✨ Next.js development environment loaded with NixOS library paths."
            '';
          };
        });
    };
}
