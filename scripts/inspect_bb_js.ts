import * as bb from "@aztec/bb.js";

async function main() {
    console.log("Inspecting @aztec/bb.js...");
    console.log("Exports:", Object.keys(bb));

    // @ts-ignore
    if (bb.UltraHonkBackend) {
        console.log("Found UltraHonkBackend");
        // @ts-ignore
        console.log("UltraHonkBackend Prototype:", Object.getOwnPropertyNames(bb.UltraHonkBackend.prototype));
    }
    // @ts-ignore
    if (bb.UltraHonkVerifierBackend) {
        console.log("Found UltraHonkVerifierBackend");
        // @ts-ignore
        console.log("UltraHonkVerifierBackend Prototype:", Object.getOwnPropertyNames(bb.UltraHonkVerifierBackend.prototype));
    }
}

main();
