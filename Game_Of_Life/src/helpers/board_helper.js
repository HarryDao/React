const INITIAL_OCCUPY_RATIO = 0.4;
const MIN_THREADHOLD = 2;
const MAX_THREADHOLD = 3;
const REBORN_LEVEL = 3;
const NEIGHBOR_OFFSETS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];


class classBoardHelper {

    GenerateNewBoard(rowNum, colNum){
        let board = [];
        for (let row = 0; row < rowNum; row ++){
            let cells = [];
            for (let col = 0; col < colNum; col ++){
                cells.push(Math.random() > (1 - INITIAL_OCCUPY_RATIO));
            }
            board.push(cells);
        }
        return board;
    }
    
    GenerateNextState(board){
        let newBoard = [];

        if (!board || !board.length){
            return newBoard;
        }

        board.map((row, rowIndex)=>{
            let newRow = [];

            row.map((cell, colIndex)=>{
                let neighborCount = 0;

                NEIGHBOR_OFFSETS.map((offset)=>{
                    if (board[rowIndex + offset[0]] 
                        && board[rowIndex + offset[0]][colIndex + offset[1]]
                    ){
                        neighborCount ++;
                    }
                });
                
                newRow.push(this.CreateCellNextState(cell, neighborCount));
            });

            newBoard.push(newRow);
        }); 
        
        return newBoard;
    }

    CreateCellNextState(current, count){
        if (count < MIN_THREADHOLD || count > MAX_THREADHOLD) {
            return false;
        }
        else if (!current && count === REBORN_LEVEL){
            return 'new';
        }
        else {
            return current ? true: false;
        }
    }
}


export default new classBoardHelper();