import * as fs from 'fs';
import * as path from 'path';

const N = 16;
const SQRT_N = 4;

function generateBaseBoard(): number[][] {
    const board: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
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
    const symbols = Array.from({ length: N }, (_, i) => i + 1);
    shuffle(symbols);
    const map = new Map();
    for (let i = 0; i < N; i++) map.set(i + 1, symbols[i]);
    
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            board[r][c] = map.get(board[r][c]);
        }
    }
    return board;
}

function main() {
    const count = 5;
    const outputDir = path.join(__dirname, '../boards');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    for (let i = 0; i < count; i++) {
        let board = generateBaseBoard();
        board = permuteBoard(board);
        
        const flat = board.flat();
        const tomlContent = `solution = [${flat.join(', ')}]`;
        
        fs.writeFileSync(path.join(outputDir, `Prover_${i}.toml`), tomlContent);
        console.log(`Generated 16x16 board ${i}`);
    }
}

main();
