global N: u32 = 16;
global SQRT_N: u32 = 4;

fn main(solution: [u8; 256]) -> pub Field {
    // 1. Range Check (1-16)
    for i in 0..256 {
        assert(solution[i] >= 1);
        assert(solution[i] <= 16);
    }

    // 2. Row Constraints
    for r in 0..N {
        let mut seen = [0; 17];
        for c in 0..N {
            let idx = r * N + c;
            let val = solution[idx] as u32;
            seen[val] = seen[val] + 1;
        }
        for k in 1..17 {
            assert(seen[k] == 1);
        }
    }

    // 3. Column Constraints
    for c in 0..N {
        let mut seen = [0; 17];
        for r in 0..N {
            let idx = r * N + c;
            let val = solution[idx] as u32;
            seen[val] = seen[val] + 1;
        }
        for k in 1..17 {
            assert(seen[k] == 1);
        }
    }

    // 4. Subgrid Constraints (4x4)
    for r_block in 0..SQRT_N {
        for c_block in 0..SQRT_N {
            let mut seen = [0; 17];
            for r in 0..SQRT_N {
                for c in 0..SQRT_N {
                    let row = r_block * SQRT_N + r;
                    let col = c_block * SQRT_N + c;
                    let idx = row * N + col;
                    let val = solution[idx] as u32;
                    seen[val] = seen[val] + 1;
                }
            }
            for k in 1..17 {
                assert(seen[k] == 1);
            }
        }
    }

    // 5. Commitment
    let mut hash: Field = 0;
    for i in 0..256 {
        hash = hash + (solution[i] as Field) * (i as Field + 1);
    }
    
    hash
}
