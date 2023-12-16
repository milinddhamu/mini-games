"use client"
import Ring from "@/TicTacToe/Ring"
import Cross from "@/TicTacToe/Cross"
import React, { useEffect, useState } from 'react';
import {Button} from "@nextui-org/button";
import Confetti from 'react-confetti'
import { initialBoard,boardDesign, calculateWinner, isDraw } from './TicTacToeLogic';

export default function TicTacToeGame(){
  const [turn , setTurn] = useState(true); // here we use false for "X" player and true for "O" player
  const [board, setBoard] = useState(initialBoard);
  const [winner, setWinner] = useState(null); // Store the winner later

  const handleCellClick = (position) => {
    if (board[position].value === '' && !calculateWinner(board)) {
      const updatedBoard = [...board];
      updatedBoard[position].value = turn ? 'O' : 'X';
      setBoard(updatedBoard);
      setTurn(!turn);
    } else if(calculateWinner(board)) {
      resetGame()
    }
  };

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setWinner(winner);
      setTimeout(() => {
        setWinner(null);
      }, 5000);
    }
  }, [board]);
  
  const resetGame = () => {
    setBoard([
      { position: 0, value: '' },
      { position: 1, value: '' },
      { position: 2, value: '' },
      { position: 3, value: '' },
      { position: 4, value: '' },
      { position: 5, value: '' },
      { position: 6, value: '' },
      { position: 7, value: '' },
      { position: 8, value: '' },
    ]);
    setWinner(null); 
    setTurn(!turn);
  };


  const renderGameStatus = () => {
    if (calculateWinner(board)) {
      return `Winner: ${calculateWinner(board)}`;
    } else if (isDraw(board)) {
      return 'It\'s a draw!';
    } else {
      return `Turn: ${turn ? 'O' : 'X'}`;
    }
  };

  return (
    <>
      <div className={boardDesign.flex}>
        <div className={boardDesign.statusContainer}>
          <h1 className={boardDesign.statusText}>{renderGameStatus()}</h1>
            <Button color="danger" onClick={resetGame}>
              Reset Game
            </Button>
        </div>
        <div className={boardDesign.gridContainer}>
        {board.map((item,i)=>(
          <button onClick={()=> handleCellClick(i)} key={i} className={boardDesign.cellButton}>
            {item.value === "X" && <Cross className="scale-125" />}
            {item.value === "O" && <Ring/>}

          </button>
        ))}
        </div> 
      </div> 
      {winner && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
        />
      )}
    </>
  )
}