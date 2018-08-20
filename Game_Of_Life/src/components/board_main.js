import React, {Component} from 'react';
import {connect} from 'react-redux';


class BoardMain extends Component {

    renderRow(row, rowIndex){
        return row.map((cell, cellIndex)=>{
            const className = `${cell ? 'active' : ''} ${cell === 'new' ? 'new' : ''}`
            return(
                <td 
                    key={`cel-${rowIndex}-${cellIndex}`} 
                    className={className}
                
                >
                </td>
            );
        });
    }

    renderBoard(){
        const {board} = this.props;
        if (board){
            return board.map((row, rowIndex)=>{
                return(
                    <tr key={`row-${rowIndex}`}>
                        {this.renderRow(row, rowIndex)}
                    </tr>
                );
            });
        }
    }
    render(){
        if (!this.props.steps || this.props.steps.length === 0){
            return <div>Loading...</div>
        }

        return(
            <div className='board-main'>
                <div className="inner">
                    <table>
                        <tbody>
                            {this.renderBoard()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ board: { steps, stepView } }){
    return {
        steps,
        board: (steps && steps[stepView]) ? steps[stepView] : []
    };
}

export default connect(mapStateToProps)(BoardMain);