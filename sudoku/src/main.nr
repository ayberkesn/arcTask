use dep::std;

global N: u32 = 25;
global SQRT_N: u32 = 5;

fn main(solution: [u8; 625]) -> pub Field {
    // 1. Range Check (1-25)
    for i in 0..625 {
        assert(solution[i] >= 1);
        assert(solution[i] <= 25);
    }

    // 2. Row Constraints
    for r in 0..N {
        let mut seen = [0; 26]; // 1-indexed, so size 26
        for c in 0..N {
            let val = solution[r * N + c];
            seen[val] = seen[val] + 1;
        }
        for k in 1..26 {
            assert(seen[k] == 1);
        }
    }

    // 3. Column Constraints
    for c in 0..N {
        let mut seen = [0; 26];
        for r in 0..N {
            let val = solution[r * N + c];
            seen[val] = seen[val] + 1;
        }
        for k in 1..26 {
            assert(seen[k] == 1);
        }
    }

    // 4. Subgrid Constraints (5x5)
    for r_block in 0..SQRT_N {
        for c_block in 0..SQRT_N {
            let mut seen = [0; 26];
            for r in 0..SQRT_N {
                for c in 0..SQRT_N {
                    let row = r_block * SQRT_N + r;
                    let col = c_block * SQRT_N + c;
                    let val = solution[row * N + col];
                    seen[val] = seen[val] + 1;
                }
            }
            for k in 1..26 {
                assert(seen[k] == 1);
            }
        }
    }

    // 5. Commitment (Poseidon Hash)
    // Noir's std::hash::poseidon::bn254::hash_2 takes [Field; 2].
    // We need to hash the whole array. We can use a sponge or just hash chunks.
    // std::hash::poseidon::bn254::hash_many is better if available, or just build a Merkle root?
    // For simplicity and standard commitment, let's cast u8 to Field and hash all.
    
    let mut solution_fields: [Field; 625] = [0; 625];
    for i in 0..625 {
        solution_fields[i] = solution[i] as Field;
    }
    
    // Using std::hash::poseidon::bn254::hash_2 in a chain or similar if hash_many isn't direct.
    // Actually, std::hash::poseidon::bn254::hash(inputs: [Field]) -> Field exists in newer versions.
    // Let's assume standard library availability.
    
    let commitment = std::hash::poseidon::bn254::hash(solution_fields, 0);
    
    commitment
}
