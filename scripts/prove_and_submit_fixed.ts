import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
// @ts-ignore
import { Noir } from "@noir-lang/noir_js";

async function main() {
    const boardsDir = path.join(__dirname, "../boards");
    const sudokuDir = path.join(__dirname, "../sudoku");
    const srcDir = path.join(sudokuDir, "src");

    // 1. Compile Circuit using real file system
    console.log("Compiling Noir circuit...");
    const fm = createFileManager(sudokuDir);
    const compiled = await compile(fm, sudokuDir);
    
    const program = compiled.program;
    console.log("Compilation successful!");

    // 2. Setup Backend
    // @ts-ignore
    const backend = new BarretenbergBackend(program as any);
    // @ts-ignore
    const noir = new Noir(program as any, backend);

    // 3. Get Verification Key (for future use)
    console.log("Getting Verification Key...");
    const vk = await backend.getVerificationKey();
    fs.writeFileSync(path.join(sudokuDir, "vk"), vk);
    console.log("Verification Key saved to sudoku/vk");

    // 4. Process Boards
    const files = fs.readdirSync(boardsDir).filter(f => f.endsWith('.toml'));
    for (const file of files) {
        const name = file.replace('.toml', '');
        console.log(`Processing ${name}...`);
        
        const tomlContent = fs.readFileSync(path.join(boardsDir, file), "utf-8");
        const match = tomlContent.match(/solution\s*=\s*\[(.*?)\]/s);
        if (!match) {
            console.error(`Could not parse solution in ${file}`);
            continue;
        }
        const solutionStr = match[1].replace(/\s/g, '').split(',');
        const solution = solutionStr.map(s => parseInt(s, 10));
        
        const inputs = { solution };

        console.log("Generating proof...");
        const { witness } = await noir.execute(inputs);
        const proof = await backend.generateProof(witness);
        console.log("Proof generated!");

        const isValid = await backend.verifyProof(proof);
        console.log(`Local verification: ${isValid}`);
        
        if (isValid) {
             console.log(`Board ${name} verified successfully off-chain.`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
