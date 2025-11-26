import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";

async function main() {
    console.log("Inspecting BarretenbergBackend...");
    console.log("Prototype:", Object.getOwnPropertyNames(BarretenbergBackend.prototype));

    // Create a dummy instance if needed (requires circuit)
    // But prototype inspection should be enough to see method names.
}

main();
