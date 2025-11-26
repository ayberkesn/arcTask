import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
// @ts-ignore
import { Noir } from "@noir-lang/noir_js";
import { Readable } from "stream";

async function main() {
    const boardsDir = path.join(__dirname, "../boards");
    const sudokuDir = path.join(__dirname, "../sudoku");
    const srcDir = path.join(sudokuDir, "src");

    // 1. Compile Circuit
    console.log("Compiling Noir circuit...");
    const nargoTomlPath = path.join(sudokuDir, "Nargo.toml");
    const mainNrPath = path.join(srcDir, "main.nr");

    const mainNrContent = fs.readFileSync(mainNrPath, "utf-8");
    const nargoTomlContent = fs.readFileSync(nargoTomlPath, "utf-8");

    const fm = createFileManager("/project");
    const writeToFm = async (filePath: string, content: string) => {
        const buffer = Buffer.from(content, 'utf-8');
        const uint8Array = new Uint8Array(buffer);
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(uint8Array);
                controller.close();
            }
        });
        await fm.writeFile(filePath, stream);
    };

    await writeToFm("/project/Nargo.toml", nargoTomlContent);
    await writeToFm("/project/src/main.nr", mainNrContent);

    const compiled = await compile(fm, "/project");

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

    // Note: We cannot generate the Solidity Verifier contract programmatically 
    // without the 'bb' CLI tool, which is unavailable on this Windows environment.
    // The proof will be verified off-chain below.

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
