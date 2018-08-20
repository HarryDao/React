import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {GAME} from '../configs/game_config';
import {CELL_IMAGES} from '../configs/images';


class GameBoard extends Component {
    constructor(props) {
        super(props);

        this.renderBoard = this.renderBoard.bind(this);
        this.centralizeUser = this.centralizeUser.bind(this);
        this.renderCellDarkness = this.renderCellDarkness.bind(this);
    }

    componentDidMount(){
        this.props.createNewBoard();
    }

    componentWillUpdate(nextProps){
        const {board, player} = nextProps;
        if (!board || !player){
            return;
        }
        const {position: {rowIndex, colIndex}, health} = player;
        const {createNewBoard, gameLevel} = this.props;

        const targetCell = board[rowIndex][colIndex];

        // Check for Door:
        if (targetCell && targetCell.door){
            createNewBoard(gameLevel + 1);    
        }

        // Check for End Game:
        if (player && (!health || health < 1)){
            this.props.endGame(health, targetCell);
        }

        if (targetCell && targetCell.boss){
            this.props.endGame(health, targetCell);
        }      
    }

    componentDidUpdate(prevProps){
        this.centralizeUser(prevProps);
    }

    centralizeUser(){
        try {
            const {board, player} = this.props;
            if (!board || !player){
                return;
            }

            const {position: {rowIndex, colIndex}} = player;
            const playerSelector = document.querySelector(`#${this.composeCellId(rowIndex, colIndex)}`);
            const scrollSelector = document.querySelector('.game-board');

            scrollSelector.scrollTop = playerSelector.offsetTop - scrollSelector.offsetHeight/2;
            
        }
        catch(err){}
    }

    composeCellId(rowIndex, colIndex){
        return `id-${rowIndex}-${colIndex}`;
    }
    


    renderCellDarkness(rowIndex, colIndex){
        const {player, darkness} = this.props;
        if (!player || !darkness){
            return false;
        } 

        const {position} = player;

        const diff = Math.sqrt(Math.pow(rowIndex - position.rowIndex, 2) +
                             Math.pow(colIndex - position.colIndex, 2));

        return diff > GAME.LIGHT_SCOPE_ON_DARKNESS;
    }

    renderCellImage(cell, isPlayer){
        let image = '';
        
        if (isPlayer){
            image = CELL_IMAGES.player
        }
        else if (cell) {
            for (let key in CELL_IMAGES){
                if (cell[key]){
                    image = CELL_IMAGES[key];
                }
            }
        }

        if (image) {
            return <img src={image} />
        }
        else {
            return <div className="empty"></div>;
        }
    }
    
    renderBoard() {
        const { board, player } = this.props;

        if (!board || !player || !player.position){
            return <tr><td>Loading...</td></tr>
        }
        
        const {position} = player;
        return board.map((row, rowIndex)=>{
            const rowCells = row.map((cell, colIndex)=>{
                const isPlayer = position && position.rowIndex == rowIndex && position.colIndex == colIndex;
                const isDarkened = this.renderCellDarkness(rowIndex, colIndex);
                const className = `
                    ${isDarkened ? 'dark' : ''} 
                    ${cell ? 'active' : ''} 
                    ${cell && isPlayer ? (player.dead ? 'player dead' : 'player') : ''}   
                    ${cell && cell.dead ? 'dead': ''} 
                    ${cell && cell.bridge ? 'bridge': ''}  
                    ${cell && cell.potion ? 'potion': ''}  
                    ${cell && cell.weapon ? 'weapon': ''} 
                    ${cell && cell.enemy ? 'enemy' : ''} 
                    ${cell && cell.door ? 'door' : ''} 
                `;
                const id = this.composeCellId(rowIndex, colIndex);

                return(
                    <td
                        className={className}
                        id = {id}
                        key={id} 
                    >{this.renderCellImage(cell, isPlayer)}</td>
                );

            });

            return(
                <tr key={`row-${rowIndex}`}>
                  {rowCells}  
                </tr>
            );

        });
    }

    render() {
        return(
            <div className='game-board'>
                <table>
                    <tbody>
                        {this.renderBoard()}
                    </tbody>
                </table>
            </div>
        );
    }
}


function mapStateToProps({game}){
    return {
        board: game.board,
        player: game.player,
        gameLevel: game.gameLevel,
        darkness: game.darkness
    };
}

export default connect(mapStateToProps, actions)(GameBoard);