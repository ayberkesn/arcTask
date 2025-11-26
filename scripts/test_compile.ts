import { compile, createFileManager } from "@noir-lang/noir_wasm";
import * as path from "path";

async function main() {
    const sudokuDir = path.join(__dirname, "../sudoku");
    console.log(`Compiling project at ${sudokuDir}`);

    try {
        // Initialize FileManager with the project directory on disk
        const fm = createFileManager(sudokuDir);

        // Compile. Pass the absolute path.
        const compiled = await compile(fm, sudokuDir);

        console.log("Compilation successful!");
        console.log("Program size:", compiled.program.bytecode.length);
    } catch (e) {
        console.error("Compilation failed:", e);
        process.exitCode = 1;
    }
}

main();
