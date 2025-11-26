import * as fs from 'fs';
import * as path from 'path';

const N = 25;
const SQRT_N = 5;

function generateBaseBoard(): number[][] {
    const board: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            // Standard formula for valid Sudoku
            // (row * SQRT_N + floor(row / SQRT_N) + col) % N + 1
            board[r][c] = ((r * SQRT_N + Math.floor(r / SQRT_N) + c) % N) + 1;
        }
    }
    return board;
}

function shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function permuteBoard(board: number[][]): number[][] {
    // 1. Shuffle symbols
    const symbols = Array.from({ length: N }, (_, i) => i + 1);
    shuffle(symbols);
    const map = new Map();
    for (let i = 0; i < N; i++) map.set(i + 1, symbols[i]);

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            board[r][c] = map.get(board[r][c]);
        }
    }

    // 2. Shuffle rows within bands
    for (let b = 0; b < SQRT_N; b++) {
        const start = b * SQRT_N;
        const rows = Array.from({ length: SQRT_N }, (_, i) => board[start + i]);
        shuffle(rows);
        for (let i = 0; i < SQRT_N; i++) {
            board[start + i] = rows[i];
        }
    }

    // 3. Shuffle bands (blocks of rows)
    const bands = Array.from({ length: SQRT_N }, (_, i) => i);
    shuffle(bands);
    const newBoard = Array.from({ length: N }, () => Array(N).fill(0));
    for (let i = 0; i < SQRT_N; i++) {
        const bandIdx = bands[i];
        for (let r = 0; r < SQRT_N; r++) {
            newBoard[i * SQRT_N + r] = board[bandIdx * SQRT_N + r];
        }
    }

    // 4. Transpose and repeat for columns (shuffle cols within stacks, shuffle stacks)
    // Transpose
    let transposed = newBoard[0].map((_, colIndex) => newBoard.map(row => row[colIndex]));

    // Shuffle rows of transposed (which are cols of original)
    for (let b = 0; b < SQRT_N; b++) {
        const start = b * SQRT_N;
        const rows = Array.from({ length: SQRT_N }, (_, i) => transposed[start + i]);
        shuffle(rows);
        for (let i = 0; i < SQRT_N; i++) {
            transposed[start + i] = rows[i];
        }
    }

    // Shuffle bands of transposed
    const colBands = Array.from({ length: SQRT_N }, (_, i) => i);
    shuffle(colBands);
    const finalTransposed = Array.from({ length: N }, () => Array(N).fill(0));
    for (let i = 0; i < SQRT_N; i++) {
        const bandIdx = colBands[i];
        for (let r = 0; r < SQRT_N; r++) {
            finalTransposed[i * SQRT_N + r] = transposed[bandIdx * SQRT_N + r];
        }
    }

    // Transpose back
    return finalTransposed[0].map((_, colIndex) => finalTransposed.map(row => row[colIndex]));
}

function main() {
    const count = 5;
    const outputDir = path.join(__dirname, '../boards');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    for (let i = 0; i < count; i++) {
        let board = generateBaseBoard();
        board = permuteBoard(board);

        // Flatten for Noir
        const flat = board.flat();
        const tomlContent = `solution = [${flat.join(', ')}]`;

        fs.writeFileSync(path.join(outputDir, `Prover_${i}.toml`), tomlContent);
        console.log(`Generated board ${i}`);
    }
}

main();
