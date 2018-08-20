class BaseHelper {
    constructor(){
        this.CreateFeature = this.CreateFeature.bind(this);
    }

    AssignRandom(base, variety){
        const min = base * (1 - variety);
        const max = base * (1 + variety);
        return Math.floor((Math.random() * (max - min) + 1) + min);
    }

    PickRandom(array){
        const random = Math.floor(Math.random() * array.length);
        return [array[random], random];
    }

    AttemptClone(value){
        try {
            return JSON.parse(JSON.stringify(value));
        }
        catch(err){
            // console.error('Clone Error:', err);
            return value;
        }
    }

    GroupBlocks(board){
        const groups = {};
        
        board.map((row, rowIndex)=>{
            row.map((cell, colIndex)=>{
                if (cell && cell.block){
                    if (!groups[cell.block]){
                        groups[cell.block] = [];
                    }
                    groups[cell.block].push({rowIndex, colIndex});
                }
            });
        });

        return groups;
    }
    
    CreateFeature(board, total, register){
        const groups = this.GroupBlocks(board);       
        const assigns = [];
        
        const MAX_LOOPS = 2;
        let loops = 0;
        
        while ( loops < MAX_LOOPS || assigns.length < total) {
            loops ++;

            for (let block in groups){
                if (assigns.length >= total){
                    break;
                }

                const toBeAssigned = Math.random() < 0.8;
                if (!toBeAssigned){
                    continue;
                }

                const group = groups[block];                       
                group.filter((cell)=>{
                    return cell && cell.block && Object.keys(cell).length === 1
                });

                if (group.length < 1){
                    continue;
                }

                const [picked, pickedIndex] = this.PickRandom(group);

                if (register(board, picked)){
                    assigns.push(picked);
                    group.splice(pickedIndex, 1);
                }

                groups[block] = group;                     
            }
        }
    }
}

export default BaseHelper;