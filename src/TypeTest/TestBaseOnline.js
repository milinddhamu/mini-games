"use client"


import { useRef, useState, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import AnimatedCaret from './AnimatedCaret';
import { useTheme } from "next-themes";
import { PiCursorClick } from "react-icons/pi";
import TypeTestResults from "./TypeTestResults";
import io from 'socket.io-client';

const socket = io('https://typetest-ws-production.up.railway.app/typetest'); // Replace with your server URL


export default function TestBaseOnline({ playerName, gameRoomId, currentAction, sentence }) {
  const { theme, setTheme } = useTheme()
  const [text, setText] = useState("");
  const [opponentText, setOpponentText] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [givenSentence, setGivenSentence] = useState(sentence);
  const [isEditing, setIsEditing] = useState(false);
  const [isGameStart, setIsGameStart] = useState(false);
  const inputRef = useRef(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStartTimer, setGameStartTimer] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [wordsMapParent] = useAutoAnimate(/* optional config */);
  const [roomId, setRoomId] = useState(gameRoomId);
  const [playerJoined, setPlayerJoined] = useState(false);


  useEffect(() => {
    const handleGameUpdate = (data) => {
      console.log(data);
      if(data.room && data.sentence){
        const opponentName = data.room.players.find(player => player.id !== socket.id)?.name || '';
        setOpponentName(opponentName);
        setGivenSentence(data.sentence);
      }
      if(data.isGameStart){
        setIsGameStart(data.isGameStart);
      }
    }
    socket.on('gameUpdate', handleGameUpdate);

    // Logic for handling socket events based on currentAction
    if (currentAction === 'create') {
      console.log('Creating room...');
      socket.emit('createRoom', { playerName, gameRoomId });
    } else if (currentAction === 'join') {
      console.log('Joining room...');
      socket.emit('joinRoom', { playerName, gameRoomId });
      setRoomId(gameRoomId); // Update the room ID state
    }

    // Clean up the effect
    return () => {
      console.log('TypeTest component unmounted');
      socket.off('gameUpdate', handleGameUpdate);
      // Disconnect or perform any necessary cleanup
    };
  }, [playerName, gameRoomId, currentAction]);

  useEffect(() => {
    socket.on('playerJoined', (playerName) => {
      // Update the state to indicate that the player has joined the room
      setPlayerJoined(true);
      
      console.log(`${playerName} has joined the room`);
    });
    socket.on('roomError', (errorMessage) => {
      console.log(`Error: ${errorMessage}`);
      // Optionally, you can update your UI to inform the user about the error
      // For example, you could display an alert or update a status message on the page
    });
  
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('playerJoined');
    };
  }, []);

  useEffect(()=>{
    socket.on('opponentStartedTyping', ({ socketId, opponentText }) => {
      // Check if the opponent's input is from the other player
      if (socketId !== socket.id) {
        // Update opponent's text in your state or wherever you're storing it
        setOpponentText(opponentText);
      }
    });
  },[])


  const handleBlur = (e) => {
    // Prevent the input from losing focus
    e.preventDefault();

  };
  const handleChange = (e) => {
    const inputText = e.target.value
    setText(inputText);
    socket.emit('startedTyping',{input:inputText ,socketId:socket.id,gameRoomId:roomId})
  };

  const handleClick = () => {
    socket.emit('startTimerAndFocus',{gameRoomId:roomId});
  };

  const INPUT_TEXT_WORDS_ARRAY = text?.trim().split(/\s+/) || [];
  const INPUT_TEXT_WORDS_ARRAY_OPPONENT = opponentText?.trim().split(/\s+/) || [];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    let timer;
    if (isEditing) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isEditing]);

  useEffect(() => {
    let startTimer;
    if (isGameStart && gameStartTimer > 0) {
      startTimer = setInterval(() => {
        setGameStartTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if(gameStartTimer === 0 && isGameStart){
      setIsEditing(true);
    }
    return () => {
      clearInterval(startTimer);
    };
  }, [isGameStart,gameStartTimer]);

  useEffect(() => {
    if (timeElapsed === 150) {
      const results = calculateResults(sentence, text, timeElapsed);
      setResult(results);
      setShowResults(true);
      setIsEditing(false);
    }
  }, [timeElapsed , sentence , text]);


  const calculateResults = (givenSentence, givenText, timeElapsed) => {
    const givenWords = givenSentence.split(" ");
    const typedWords = givenText.trim().split(/\s+/);
    const totalWords = givenWords.length;
  
    // Calculate correct, incorrect, skipped, and extra words
    let correctWords = 0;
    let incorrectWords = 0;
    let skippedWords = 0;
    let extraWords = 0;
  
    for (let i = 0; i < totalWords; i++) {
      if (typedWords[i] === givenWords[i]) {
        correctWords++;
      } else if (!typedWords[i]) {
        skippedWords++;
      } else {
        incorrectWords++;
      }
    }
  
    // Calculate words per minute
    const wordsPerMinute = +(correctWords / timeElapsed * 60).toFixed(2);  
    return {
      wordsPerMinute,
      correctWords,
      incorrectWords,
      skippedWords,
      extraWords,
    };
  };
  

  return (
    <>
      {showResults ?
      <TypeTestResults data={result} /> :
      <div className="flex flex-col justify-center items-center w-full h-full" >
        <div className="flex w-full justify-between items-center max-w-7xl">
        <h2 className=" text-2xl text-start w-full  px-4 font-bold">{INPUT_TEXT_WORDS_ARRAY[0] === "" ? 0 : INPUT_TEXT_WORDS_ARRAY.length} / {sentence.split(" ").length}</h2>
        <h2 className="text-2xl text-center w-full px-4 font-bold"><span className="text-blue-500">{playerName}</span> vs <span className="text-red-500">{opponentName || "waiting.."}</span></h2>
        <h2 className=" text-2xl text-end w-full px-4 font-bold">{"00:"}{timeElapsed < 10 ? `0${timeElapsed}` : timeElapsed}</h2>
        </div>
        <div className="relative test-base-area z-30 p-4" onClick={handleClick}>
          {isEditing === false &&
            <div className={`absolute flex w-full max-w-7xl text-md font-semibold tracking-widest h-full justify-center items-center ${theme === "dark" ? "bg-black/10" : "bg-white/10"} uppercase`}>
            {isGameStart ?<>{`Game starts in ${gameStartTimer}`}</> :<>Click on this area to start game in 5s <PiCursorClick className="mx-4 text-3xl" /> </>}
            </div>
          }                                                 {/* h-[156px] sm:h-[150px] used for below */}
          <div className={` flex flex-wrap content-start w-full max-w-7xl  text-slate-500 p-4 font-medium font-mono text-2xl sm:text-3xl tracking-wide select-none scrollbar-hide z-40 snap-y ${!isEditing ? "blur overflow-hidden" : ""}`} ref={wordsMapParent} >
            {givenSentence.split(" ").map((word, wordIndex) => {
              const EQUAL_INDEX_WORD_INPUT = INPUT_TEXT_WORDS_ARRAY?.at(wordIndex);
              const EQUAL_INDEX_WORD_INPUT_OPPONENT = INPUT_TEXT_WORDS_ARRAY_OPPONENT?.at(wordIndex);
              const defaultWord = word;
              if (EQUAL_INDEX_WORD_INPUT?.length > word.length) {
                word += EQUAL_INDEX_WORD_INPUT.slice(word.length);
              }
              return (
                <span key={`word_${word}_${wordIndex}`} className={`border-red-500 ${(INPUT_TEXT_WORDS_ARRAY?.length > wordIndex + 1 && EQUAL_INDEX_WORD_INPUT !== defaultWord) ? "border-b-2" : ""}`} >
                  {word.split("").map((letter, letterIndex) => {
                    const LETTER_ARRAY_OF_EQUAL_WORD = EQUAL_INDEX_WORD_INPUT?.split("");
                    const LETTER_ARRAY_OF_EQUAL_WORD_OPPONENT = EQUAL_INDEX_WORD_INPUT_OPPONENT?.split("");
                    const InputLetterAtSameIndex = LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex)
                    return (
                      <span key={`letter_${wordIndex}_${letterIndex}_${letter}`} className={`${
                        InputLetterAtSameIndex !== undefined
                          ? InputLetterAtSameIndex === defaultWord?.at(letterIndex)
                            ? "text-green-500"
                            : "text-red-500"
                          : ""
                       }
                      `}>
                      {
                        isEditing &&
                        INPUT_TEXT_WORDS_ARRAY?.length === wordIndex &&
                        letterIndex === 0 &&
                        text.at(-1) === " " &&
                        <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={false} />
                        </span>
                      }
                      {
                        isEditing &&
                        INPUT_TEXT_WORDS_ARRAY_OPPONENT?.length === wordIndex &&
                        letterIndex === 0 &&
                        opponentText.at(-1) === " " &&
                        <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={true} />
                        </span>
                      }
                      {letterIndex === 0 &&
                       wordIndex === 0 &&
                       isEditing &&
                       text === "" &&
                      <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={false} />
                        </span>}
                      {letterIndex === 0 &&
                       wordIndex === 0 &&
                       isEditing &&
                       opponentText === "" &&
                      <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={true} />
                        </span>}
                      {letter}
                      {
                        LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex) !== undefined &&
                        letterIndex === LETTER_ARRAY_OF_EQUAL_WORD.length - 1 &&
                        INPUT_TEXT_WORDS_ARRAY.length === wordIndex + 1 &&
                        isEditing &&
                        text.at(-1) !== " " &&
                        <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={false} />
                        </span>
                      }
                      {
                        LETTER_ARRAY_OF_EQUAL_WORD_OPPONENT?.at(letterIndex) !== undefined &&
                        letterIndex === LETTER_ARRAY_OF_EQUAL_WORD_OPPONENT.length - 1 &&
                        INPUT_TEXT_WORDS_ARRAY_OPPONENT.length === wordIndex + 1 &&
                        isEditing &&
                        opponentText.at(-1) !== " " &&
                        <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={true} />
                        </span>
                      }

                    </span>
              );
            })}&nbsp;
          </span>
          )})}

      </div>
      </div>
      {
      <div className='absolute'>
      <input
          ref={inputRef}
          type="text"
          id="INPUT_FOR_TYPING_TEST"
          value={text}
          onBlur={handleBlur}
          onChange={handleChange}
          className="w-full h-full pointer-events-none opacity-0 text-3xl cursor-text border-none p-4"
        /></div> }
    </div>
    }
    </>
  );
}
