import PotionHelper from './potion_helper';
import BoardHelper from './board_helper';
import WeaponHelper from './weapon_helper';
import EnemyHelper from './enemy_helper';
import {PLAYER, PLAYER_LEVEL} from '../configs/game_config';

const {PLAYER_BASE_HEALTH} = PLAYER;
const {
    PLAYER_LEVEL_BASE,
    PLAYER_LEVEL_EXP_BASE,
    EXP_INCREASE_PER_PLAYER_LEVEL,
    ATTACK_BONUS_PER_PLAYER_LEVEL,
} = PLAYER_LEVEL



class PlayerHelper {
    constructor(){
        this.Initiate = this.Initiate.bind(this);
        this.InitiatePosition = this.InitiatePosition.bind(this);
        this.InitPlayerLevel = this.InitPlayerLevel.bind(this);
        this.onExpChange = this.onExpChange.bind(this);
        this.MovePlayer = this.MovePlayer.bind(this);
        this.WinConditionCheck = this.WinConditionCheck.bind(this);
    }

    Initiate(board, positionOnly = false){
        const position = this.InitiatePosition(board);
        if (positionOnly){
            return position;
        }
        
        const weapon = WeaponHelper.InitPlayerWeapon();
        const {level, exp} = this.InitPlayerLevel();
        const attack = this.CalculatePlayerAttack({weapon, level});

        return {
            health: PLAYER_BASE_HEALTH,
            level,
            position,
            weapon,
            level,
            attack,
            exp,
        }
    }

    InitiatePosition(board){
        const possibilities = [];
        board.map((row, rowIndex)=>{
            row.map((cell, colIndex)=>{
                if (cell && cell.block && Object.keys(cell).length === 1){
                    possibilities.push({rowIndex, colIndex});
                }
            });
        });

        if (possibilities.length > 0){
            const random = Math.floor(Math.random() * possibilities.length);
            return possibilities[random];
        }


        return null;
    }
    
    CalculatePlayerAttack({weapon, level}){
        return weapon.attack + level * ATTACK_BONUS_PER_PLAYER_LEVEL;
    }
    
    InitPlayerLevel(){
        const level = PLAYER_LEVEL_BASE;
        const exp = this.CalculateLevelExp(level);
        return {level, exp};
    }
    
    CalculateLevelExp(level){
        return PLAYER_LEVEL_EXP_BASE + Math.floor(EXP_INCREASE_PER_PLAYER_LEVEL * level);
    }
    
    onExpChange(player, expChange){
        let {level, exp, weapon, attack} = player;

        exp -= expChange;
        if (exp < 0){
            level ++;
            exp += this.CalculateLevelExp(level);
            attack = this.CalculatePlayerAttack({weapon, level});
        }

        player = {...player, level, exp, attack};
        return player;
    }

    MovePlayer(keypress, board, player){
        board = [...board];
        player = {...player};
        const keymap = {
            'ArrowUp': ['rowIndex', -1],
            'ArrowDown': ['rowIndex', 1],
            'ArrowLeft': ['colIndex', -1],
            'ArrowRight': ['colIndex', 1],
        }
        const effects = [
            BoardHelper.onLandingEffect,
            PotionHelper.onLandingEffect,
            WeaponHelper.onLandingEffect,
            EnemyHelper.onLandingEffect,
        ];

        if (!keypress || !keymap[keypress]){
            return null;
        }

        const key = keymap[keypress];
        const position = {...player.position};
        position[key[0]] += key[1];     
    
        if (!board[position.rowIndex]){
            return null;
        }

        let canMove = true;
        effects.map((effect)=>{
            ({player, board, canMove} = effect(player, board, position, canMove));
            
        });
        if (canMove){
            player.position = position;
        }

        return {player, board};
    }

    WinConditionCheck(player, enemy){

        if (!player || !enemy || !enemy.boss){
            return null;
        }

        const canLose = player && player.dead ? true: false;;
        const canWin = enemy && enemy.boss && enemy.dead ? true: false;

        if (canLose && !canWin){
            return 'lose';
        }
        else if (!canLose && canWin){
            return 'win';
        }
        else if (canLose && canWin){
            return 'draw'
        }
        else {
            return null;
        }
    }
}


export default new PlayerHelper();