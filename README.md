# ZK-Sudoku on Arc

This project implements a ZK-Sudoku verifier on Arc.

## Prerequisites

- **OS**: Linux or macOS (Windows requires WSL)
- **Noir**: Install `nargo` via `noirup`.
- **Barretenberg**: Install `bb` CLI.
- **Node.js**: v18+.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Noir & Barretenberg (if not already):
   ```bash
   curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
   noirup
   npm install -g @aztec/bb
   ```

## Usage

1. **Generate Boards**:
   ```bash
   npx ts-node scripts/generate_board.ts
   ```

2. **Generate Proofs & Verify**:
   ```bash
   # This script compiles the circuit, generates proofs, and verifies them off-chain.
   # It also attempts to generate the Solidity verifier (requires 'bb' CLI).
   npx ts-node scripts/prove_and_submit.ts
   ```

3. **Deploy to Arc**:
   - Once `contracts/Verifier.sol` is generated (requires `bb`), deploy it using Hardhat:
   ```bash
   npx hardhat run scripts/deploy.ts --network arc
   ```

## Current Status

- **Circuit**: Implemented in `sudoku/src/main.nr`.
- **Contracts**: Wrapper `SudokuVerifier.sol` ready.
- **Scripts**: Board generation and proof orchestration ready.
- **Issue**: Compilation and Verifier generation require `nargo` and `bb` CLI tools, which could not be installed on this Windows machine due to system restrictions.
