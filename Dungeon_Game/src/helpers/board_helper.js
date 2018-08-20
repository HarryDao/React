import HelperBase from './base';
import PotionHelper from './potion_helper';
import WeaponHelper from './weapon_helper';
import EnemyHelper from './enemy_helper';
import DoorHelper from './door_helper';
import {
    BOARD,
    CELL,
} from '../configs/game_config';



class BoardHelper extends HelperBase {
    constructor(){
        super();

        this.CreateNewBoard = this.CreateNewBoard.bind(this);
        this.CreateFirstBlock = this.CreateFirstBlock.bind(this);
        this.CreateSubsequentBlock = this.CreateSubsequentBlock.bind(this);
        this.CheckSubsequentBlockValidity = this.CheckSubsequentBlockValidity.bind(this);
        this.RegisterBlock = this.RegisterBlock.bind(this);
        this.CreateBridges = this.CreateBridges.bind(this);
        this.RegisterBridges = this.RegisterBridges.bind(this);
    }

    CreateNewBoard(gameLevel){
        const newBoard = new Array(BOARD.BOARD_ROWS).fill(new Array(BOARD.BOARD_COLS).fill(CELL.CELL_DEFAULT_VALUE));
        this.board = JSON.parse(JSON.stringify(newBoard));
        for (let i = 1; i <= BOARD.MAX_TOTAL_BLOCKS; i ++){
            if (i === 1){
                this.CreateFirstBlock();
            }
            else {
                this.CreateSubsequentBlock(i);
            }
        }

        this.CreateBridges();
        PotionHelper.CreatePotions(this.board);
        WeaponHelper.CreateWeapons(this.board);
        EnemyHelper.CreateEnemies(this.board, gameLevel);
        DoorHelper.CreateDoor(this.board, gameLevel);
        return this.board;
    }

    GenerateBlockSize(){
        const blockRow = Math.floor(BOARD.BOARD_ROWS / Math.sqrt(BOARD.MAX_TOTAL_BLOCKS));
        const maxBlockRow = Math.floor(blockRow * (1 + BOARD.BLOCK_SIZE_VARIETY));
        const minBlockRow = Math.floor(blockRow * (1 - BOARD.BLOCK_SIZE_VARIETY));

        const blockCol = Math.floor(BOARD.BOARD_COLS / Math.sqrt(BOARD.MAX_TOTAL_BLOCKS));
        const maxBlockCol = Math.floor(blockCol * (1 + BOARD.BLOCK_SIZE_VARIETY));
        const minBlockCol = Math.floor(blockCol * (1 - BOARD.BLOCK_SIZE_VARIETY));

        const row = Math.floor(Math.random() * (maxBlockRow - minBlockRow + 1) + minBlockRow);
        const col = Math.floor(Math.random() * (maxBlockCol - minBlockCol + 1) + minBlockCol);
        return {row, col};
    }

    CreateFirstBlock(){
        const board = this.board;
        const block = this.GenerateBlockSize();

        const possibilities = [];    
        board.map((row, rowIndex)=>{
            row.map((cell, colIndex)=>{
                let isValid = true;
                loop1: 
                for (let blockRow = rowIndex; blockRow < rowIndex + block.row; blockRow ++ ){
                loop2:
                    for (let blockCol = colIndex; blockCol < colIndex + block.col; blockCol ++ ){
                        if (!board[blockRow] || board[blockRow][blockCol] !== CELL.CELL_DEFAULT_VALUE){
                            isValid = false;
                            break loop1;
                        }
                    }
                }
                if (isValid){
                    possibilities.push({rowIndex, colIndex});
                }
            });
        });
    
        if (possibilities.length > 0){
            this.RegisterBlock(1, block, possibilities)
        }
    
    }

    CreateSubsequentBlock(blockNumber){
        const board = this.board;
        const block = this.GenerateBlockSize();

        const possibilities = [];
        board.map((row, rowIndex)=>{
            row.map((cell, colIndex)=>{
                const targetArea = {
                    rowMin: rowIndex,
                    rowMax: rowIndex + block.row - 1,
                    colMin: colIndex,
                    colMax: colIndex + block.col - 1,
                }
                const checkArea = {
                    rowMin: rowIndex - 1,
                    rowMax: rowIndex - 1 + block.row - 1 + 2,
                    colMin: colIndex - 1,
                    colMax: colIndex - 1 + block.col - 1 + 2,
                }
    
                if (this.isOutOfBoardScope(targetArea.rowMax, targetArea.colMax)){
                    return;
                }
    
                const isValid = this.CheckSubsequentBlockValidity(targetArea, checkArea);
                if (isValid){
                    possibilities.push({rowIndex, colIndex});
                }
            });
        });
    
        if (possibilities.length > 0){
            this.RegisterBlock(blockNumber, block, possibilities);
        }
        
    }

    CheckSubsequentBlockValidity(targetArea, checkArea){
        const board = this.board;
        const {rowMin, rowMax, colMin, colMax} = checkArea;

        let isValid = false;
        loop1:
        for (let r = rowMin; r <= rowMax; r ++){
            loop2:
            for (let c = colMin; c <= colMax; c ++){
                if (this.isOutOfBoardScope(r, c) || this.isWithinTargetScope(targetArea, r, c)){
                    continue;
                }
    
                if (board[r][c] !== CELL.CELL_DEFAULT_VALUE){
                    isValid = false;
                    break loop1;
                }
    
                const testPairs = [
                    [
                        [r + 1, c],
                        [r - 1, c]
                    ],
                    [
                        [r, c + 1],
                        [r, c - 1],
                    ]
                ];
                testPairs.map((pair)=>{
                    const [testCell1, testCell2] = pair;
    
                    const test = (cellA, cellB)=>{
                        return this.isWithinTargetScope(targetArea, cellA[0], cellA[1]) 
                                && board[cellB[0]]
                                && board[cellB[0]][cellB[1]] ? true : false;
                    }
    
                    if (test(testCell1, testCell2) || test(testCell2, testCell1)){
                        isValid = true;
                    }
                });
            }
        }
        
        return isValid;
    }

    RegisterBlock(blockNumber, block, possibilities){
        const board = this.board;

        if (possibilities.length < 1){
            return;
        }

        const [{rowIndex, colIndex}] = this.PickRandom(possibilities);

        for (let r = rowIndex; r < rowIndex + block.row; r ++){
            for (let c = colIndex; c < colIndex + block.col; c ++){
                board[r][c] = {
                    block: blockNumber
                };
            }
        }   
    }

    CreateBridges(){
        const board = this.board;
        const bridges = {};
        board.map((row, rowIndex)=>{
            row.map((cell, colIndex)=>{
                if (cell !== CELL.CELL_DEFAULT_VALUE){
                    return;
                }

                const tests = [
                    [
                        [rowIndex + 1, colIndex],
                        [rowIndex - 1, colIndex]
                    ],
                    [
                        [rowIndex, colIndex + 1],
                        [rowIndex, colIndex - 1]
                    ]
                ];

                let founded = false;
                tests.map((test)=>{
                    if (founded || !board[test[0][0]] || !board[test[1][0]]){
                        return;
                    }

                    const cell1 = board[test[0][0]][test[0][1]];
                    const cell2 = board[test[1][0]][test[1][1]];

                    if (cell1 && cell1.block && cell2 && cell2.block){
                        founded = true;
                        
                        const block1 = parseInt(cell1.block);
                        const block2 = parseInt(cell2.block);
                        const key = `${Math.min(block1, block2)}-${Math.max(block1, block2)}`;

                        if (!bridges[key]){
                            bridges[key] = [];
                        }
                        bridges[key].push({rowIndex, colIndex});
                    }
                });
            })
        });
        this.RegisterBridges(bridges);
    }

    RegisterBridges(bridges) {
        const {board} = this;
        for (let key in bridges){
            const bridge = bridges[key];
            const [{rowIndex, colIndex}] = this.PickRandom(bridge);
            board[rowIndex][colIndex] = { bridge: true }
        }
    }

    onLandingEffect(player, board, {rowIndex, colIndex}, canMove){
        const nextCell = board[rowIndex][colIndex];
        canMove = canMove ? (nextCell ? true: false) : false;

        return {player, board, canMove}
    }

    isOutOfBoardScope(r, c){
        if (r < 0 || r > BOARD.BOARD_ROWS - 1 || c < 0 || c > BOARD.BOARD_COLS - 1){
            return true
        }
        return false;
    }
    
    isWithinTargetScope(targetArea, r, c){
        if (r >= targetArea.rowMin && r <=targetArea.rowMax && c >=targetArea.colMin && c <=targetArea.colMax){
            return true
        }
        return false
    }
}

export default new BoardHelper()

