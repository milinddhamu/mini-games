"use client"
import Ring from "@/TicTacToe/Ring"
import Cross from "@/TicTacToe/Cross"
import React, { useEffect, useState } from 'react';
import {Button} from "@nextui-org/button";
import Confetti from 'react-confetti'

export default function TicTacToeGame(){
  const [turn , setTurn] = useState(true); // here we use false for "X" player and true for "O" player
  const [board, setBoard] = useState([
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

  const calculateWinner = (board) => {
    const markedCount = board.filter((cell) => cell.value !== '').length;
    if (markedCount < 3) {
      return null;
    }
  
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (const combo of winCombos) {
      const [a, b, c] = combo;
      if (board[a].value && board[a].value === board[b].value && board[a].value === board[c].value) {
        return board[a].value;
      }
    }
  
    return null;
  };
  
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

  const isDraw = () => {
    if (!calculateWinner(board) && board.every((cell) => cell.value !== '')) {
      return true;
    }
    return false;
  };

  const renderGameStatus = () => {
    if (calculateWinner(board)) {
      return `Winner: ${calculateWinner(board)}`;
    } else if (isDraw()) {
      return 'It\'s a draw!';
    } else {
      return `Turn: ${turn ? 'O' : 'X'}`;
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 mt-8 items-center w-full gap-4">
        <div className="flex flex-row justify-between items-center w-full max-w-lg px-6 gap-4">
          <h1 className="font-semibold text-2xl">{renderGameStatus()}</h1>
            <Button color="danger" onClick={resetGame}>
              Reset Game
            </Button>
        </div>
        <div className="grid grid-cols-3 grid-rows-3 grid-flow-row gap-2 max-w-lg w-full">
        {board.map((item,i)=>(
          <button onClick={()=> handleCellClick(i)} key={i} className="flex justify-center items-center w-full aspect-square rounded-xl border border-gray-500/50 hover:bg-white/10 transition-all ease-linear duration-300">
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