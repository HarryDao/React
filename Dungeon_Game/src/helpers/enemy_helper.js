import Base from './base';
import PlayerHelper from './player_helper';
import {ENEMY, GAME} from '../configs/game_config';

const {
    ENEMIES_PER_LEVEL,
    ENEMY_ATTACK_BASE,
    ENEMY_ATTACK_VARIETY,
    ENEMY_HEALTH_BASE,
    ENEMY_HEALTH_VARIETY,
    ENEMY_ATTACK_BONUS_PER_GAME_LEVEL,
    ENEMY_HEALTH_BONUS_PER_GAME_LEVEL,
    BOSS_ATTACK_BONUS, 
    BOSS_HEALTH_BONUS,
} = ENEMY;

const {
    GAME_INITIAL_LEVEL,
    GAME_TOTAL_LEVELS
} = GAME;



class EnemyHelper extends Base {
    constructor(){
        super();
        this.CreateEnemies = this.CreateEnemies.bind(this);
        this.Register = this.Register.bind(this);
        this.onLandingEffect = this.onLandingEffect.bind(this);
    }
    CreateEnemies(board, level){
        this.gameLevel = {
            level,
            haveBoss: level === GAME_TOTAL_LEVELS,
            bossAssigned: false
        }
        this.CreateFeature(board, ENEMIES_PER_LEVEL, this.Register);

    }
    Register(board, {rowIndex, colIndex}){
        try {
            const {level, haveBoss, bossAssigned} = this.gameLevel;

            let attack = this.GenerateEnemyIndicators(
                level,
                ENEMY_ATTACK_BASE,
                ENEMY_ATTACK_VARIETY,
                GAME_INITIAL_LEVEL,
                ENEMY_ATTACK_BONUS_PER_GAME_LEVEL,
            );

            let health = this.GenerateEnemyIndicators(
                level,
                ENEMY_HEALTH_BASE,
                ENEMY_HEALTH_VARIETY,
                GAME_INITIAL_LEVEL,
                ENEMY_HEALTH_BONUS_PER_GAME_LEVEL,
            );

            const isBoss = haveBoss && !bossAssigned;
            
            if (isBoss){
                attack = Math.floor(attack * (1 + BOSS_ATTACK_BONUS));
                health = Math.floor(health * (1 + BOSS_HEALTH_BONUS));
                this.gameLevel.bossAssigned = true;                
            }

            board[rowIndex][colIndex].enemy = {
                health, 
                attack, 
                exp: health
            };

            if (isBoss){
                board[rowIndex][colIndex].boss = true;
            }

            return true;
        }
        catch(err){
            // console.error('Regiter enemy:', err);
            return false;
        }
    }
    GenerateEnemyIndicators(level, base, variety, initialLevel, bonusPerLevel){
        let indicator = this.AssignRandom(base, variety);
        let levelBonus = 1 + bonusPerLevel * (level - initialLevel);
        return Math.floor(indicator * levelBonus);
    }
    onLandingEffect(player, board, {rowIndex, colIndex}, canMove){
        let nextCell = board[rowIndex][colIndex];
        if (!nextCell || !nextCell.enemy){
            return {player, board, canMove};
        }

        let {health, attack, exp} = nextCell.enemy;

        player.health -= attack;
        health -= player.attack;

        if (player.health < 1){
            player.health = 0;
            player.dead = true;
        }

        if (health < 1){
            delete nextCell.enemy;
            if (nextCell.boss){
                nextCell.dead = true;
            }
        }
        else {
            nextCell.enemy.health = health;
        }

        // win condition check:
        const outcome = PlayerHelper.WinConditionCheck(player, nextCell);
        if (outcome){
            player.outcome = outcome;
        }

        // canMove condition:
        if (player.outcome){
            canMove = false;
        }
        else if (health < 1){
            player = PlayerHelper.onExpChange(player, exp);
            canMove = true;
        }
        else {
            canMove = false;
        }

        return {player, board, canMove};
    }
}

export default new EnemyHelper();