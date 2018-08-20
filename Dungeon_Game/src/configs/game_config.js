export const GAME = {
    GAME_INITIAL_LEVEL: 1,
    GAME_TOTAL_LEVELS: 3,
    LIGHT_SCOPE_ON_DARKNESS: 4
}

export const BOARD = {
    BOARD_ROWS: 40,
    BOARD_COLS: 30,
    MAX_TOTAL_BLOCKS: 10,
    BLOCK_SIZE_VARIETY: 0.5, //calculation: +/- (x*100)%. I.e: 0.5 -> +/- 50%;, 
}

export const CELL = {
    CELL_DEFAULT_VALUE: null
}

export const ENEMY = {
    ENEMIES_PER_LEVEL: 5,
    ENEMY_ATTACK_BASE: 15,
    ENEMY_ATTACK_VARIETY: 0.2,
    ENEMY_HEALTH_BASE: 20,
    ENEMY_HEALTH_VARIETY: 0.2,
    ENEMY_ATTACK_BONUS_PER_GAME_LEVEL: 0.2,
    ENEMY_HEALTH_BONUS_PER_GAME_LEVEL: 0.2,
    BOSS_ATTACK_BONUS: 2.5,
    BOSS_HEALTH_BONUS: 2.5,
}

export const POTION = {
    POTIONS_PER_LEVEL: 5,
    POTION_RECOVERY_BASE: 20,
    POTION_RECOVERY_VARIETY: 0.2,
    POTION_BONUS_PER_GAME_LEVEL: 0.2,
}

export const PLAYER_LEVEL = {
    PLAYER_LEVEL_BASE: 0,
    PLAYER_LEVEL_EXP_BASE: 60,
    EXP_INCREASE_PER_PLAYER_LEVEL: 0.2,
    ATTACK_BONUS_PER_PLAYER_LEVEL: 10
}

export const WEAPON = {
    WEAPONS_PER_LEVEL: 2,
    WEAPON_ATTACK_BASE: 8,
    WEAPON_INITIAL_LEVEL: 0,
    WEAPON_BONUS_PER_LEVEL: 4,
    WEAPON_NAME: [
        'Knife',
        'Club',
        'Super Club',
        'Small Hammer',
        'Big Hammer',
        'Sword',
        'Better Sword',
        'Super Sword',
        'Long Sword',
        'Super Long Sword',
    ],
    WEAPON_LEGENDARY_NAME: 'Legendary Sword',
}

export const PLAYER = {
    PLAYER_BASE_HEALTH: 100,
}

