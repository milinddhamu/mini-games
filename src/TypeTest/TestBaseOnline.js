"use client"

import { useRef, useState, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import AnimatedCaret from './AnimatedCaret';
import Scoreboard from './Scoreboard';
import { useTheme } from "next-themes";
import { BsCursorFill } from "react-icons/bs";
import MemoizedTypeTestResults from "./TypeTestResults"
import dataset from "@/app/typetest/data";
import { useDisclosure} from "@nextui-org/react";
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import generateAnonymousToken from '@/../server/helper/webSocketHelper'

const secret = process.env.NEXT_PUBLIC_JWT_SECRET 


const token = generateAnonymousToken({secret});


const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/typetest`,{
                  auth: {
                    token: token,
                  },
                });; // Replace with your server URL
export default function TestBaseOnline({ playerName, gameRoomId, currentAction }) {
  const { theme, setTheme } = useTheme();
  const [text, setText] = useState("");
  const [givenSentence, setGivenSentence] = useState("The quick brown fox, known for its remarkable agility and sly demeanor, effortlessly jumps over the lazy dog, showcasing the inherent beauty of nature and the harmony that exists between different creatures in the wild.");
  const [opponentText, setOpponentText] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [playerSelfName , setPlayerSelfName] = useState(playerName)
  const [isGameStart, setIsGameStart] = useState(false);
  const [gameStartTimer, setGameStartTimer] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [opponentResult, setOpponentResult] = useState(null);
  const [isSameTest, setIsSameTest] = useState(null);
  const [wordsMapParent] = useAutoAnimate(/* optional config */);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [roomId, setRoomId] = useState(gameRoomId);
  const [playerJoined, setPlayerJoined] = useState(false);

  // ONLINE MODE , SOCKET CODE FOR CLIENT SIDE
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
    socket.on('connect_error', (error) => {
      console.log("Connection error:", error);
    
      // You can show an alert or update the UI to inform the user about the connection error
      // For example, you might display a message on the page or redirect the user to an error page
    });
    
    // Check the connection status before attempting to emit events
    if (socket.connected) {
      // Logic for handling socket events based on currentAction
      if (currentAction === 'create') {
        socket.emit('createRoom', { playerName, gameRoomId });
      } else if (currentAction === 'join') {
        console.log('Joining room...');
        socket.emit('joinRoom', { playerName, gameRoomId });
        setRoomId(gameRoomId); // Update the room ID state
      }
    } else {
      // The socket is not connected, handle accordingly
      toast.error('Socket is not connected, please try again!', {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: "Bounce",
        });
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
  },[]) ;

  useEffect(() => {
    // Handle the game restart event
    socket.on('gameRestart', ({ gameRoomId }) => {
  
        setShowResults(false);
        setText("");
        setOpponentText("");
        setGameStartTimer(5);
        setTimeElapsed(0);
        setResult(null);
        setIsSameTest(null);
        setIsEditing(false);
      
    });
  
    // ... (other useEffect cleanup)
  
    return () => {
      // Clean up the effect
      socket.off('gameRestart');
    };
  }, [/* dependencies */]);

  // END OF ONLINE CODE

  const handleBlur = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    const inputText = e.target.value
    setText(inputText);
    socket.emit('startedTyping',{input:inputText ,socketId:socket.id,gameRoomId:roomId})
  };

  const handleClick = () => {
    if(!isGameStart && !isEditing){
      socket.emit('startTimerAndFocus',{gameRoomId:roomId});
    }
    if(!inputRef.current.contains(document.activeElement) && isGameStart){
      inputRef.current.focus();
    }
  };

  const INPUT_TEXT_WORDS_ARRAY = text?.trim().split(/\s+/) || [];  // ARRAY OF WORDS OF SELF INPUT
  const INPUT_TEXT_WORDS_ARRAY_OPPONENT = opponentText?.trim().split(/\s+/) || []; // ARRAY OF WORDS , OF OPPONENT'S TEXT

  useEffect(() => {
    if (isEditing && isGameStart && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    let timer;
    if (isEditing && timeElapsed <= 30) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isEditing]);

  // GAME START TIMER 5s DEFAULT

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
    if (timeElapsed === 30) {
      // const results = calculateResults(givenSentence, text, timeElapsed);
      // const opponentResults = calculateResults(givenSentence, opponentText, timeElapsed);
      setOpponentResult(() => calculateResults(givenSentence, opponentText, timeElapsed))
      setResult(()=> calculateResults(givenSentence, text, timeElapsed));
      setShowResults(true);
      setIsEditing(false);
    }
  }, [timeElapsed , givenSentence , text]);

  const calculateResults = (sentence, givenText, timeElapsed) => {
    const givenWords = sentence.split(" ");
    const typedWords = givenText.trim().split(/\s+/);
    const totalWords = Math.max(givenWords.length, typedWords.length);
  
    // Calculate correct, incorrect, skipped, and extra words
    let correctWords = 0;
    let incorrectWords = 0;
    let skippedWords = 0;
    let extraWords = 0;
  
    for (let i = 0; i < totalWords; i++) {
      const givenWord = givenWords[i] || ""; // Use an empty string if the word doesn't exist
      const typedWord = typedWords[i] || "";
  
      if (typedWord === givenWord) {
        correctWords++;
      } else if (!typedWord) {
        skippedWords++;
      } else {
        incorrectWords++;
        extraWords++;
      }
    }
  
    // Calculate accuracy percentage
    const accuracy = +((correctWords / (correctWords + incorrectWords)) * 100).toFixed(2);
  
    // Calculate words per minute based on correct words
    const wordsPerMinute = Math.floor((typedWords.length / timeElapsed) * 60);
  
    return {
      wordsPerMinute,
      correctWords,
      incorrectWords,
      skippedWords,
      extraWords,
      accuracy,
    };
  };
  
  const broadcastHandleRestart = () => socket.emit('restartGame', { gameRoomId: roomId });

  const handleRestart = () => {
    if(showResults){
      setShowResults(false)
      setText("");
      setOpponentText("");
      setGameStartTimer(5)
      setTimeElapsed(0);
      setResult(null);
      setIsEditing(false);
    };
    
  };

  // useEffect(() => {
  //   if (!showResults && result === null) {
  //     const shuffledDataset = dataset.sort(() => Math.random() - 0.5);
  //     const randomSentence = shuffledDataset.length > 0 ? shuffledDataset[0] : "";
      
  //     if (!isSameTest) {
  //       setGivenSentence(randomSentence);
  //     }

  //     handleClick();
  //   }
  // }, [isSameTest, showResults, result]);
  
  // useEffect(()=>{
  //   if(result && typeof window !== 'undefined'){
  //     const storedResults = JSON.parse(localStorage.getItem('results')) || [];
  //     storedResults.push(result);

  //     const lastTenResults = storedResults?.slice(-10);

  //     localStorage.setItem('results', JSON.stringify(lastTenResults));
  //   }
  // },[result]);

  return (
    <>
        <div className="flex flex-col justify-center items-center w-full h-full relative" >
        {!isEditing && <div className="absolute flex w-full justify-center p-4 top-5">
          <button onClick={onOpen} id="Scoreboard">
          <h1 className="text-violet-400/70 hover:text-violet-400 hover:underline hover:curor-pointer font-mono text-xl font-bold transition-all">Recent Scores &#x1F6C8;</h1>
          </button>
        </div>}
        <h2 className="text-2xl text-center w-full px-4 font-bold"><span className="text-blue-500">{playerName}</span> vs <span className="text-red-500">{opponentName || "waiting.."}</span></h2>
      {
      showResults ?
      <div className="flex flex-col sm:flex-row gap-2 mt-56 md:mt-24"><MemoizedTypeTestResults data={result} handleRestart={broadcastHandleRestart} handleStartSame={setIsSameTest} type="player" /> 
      <MemoizedTypeTestResults data={opponentResult} handleRestart={broadcastHandleRestart} type="opponent" /> </div> :
        <div className="relative test-base-area max-w-7xl z-30 hover:cursor-pointer" onClick={handleClick}>
          {!isEditing &&
            <div className={`absolute flex w-full text-md font-semibold tracking-widest h-full justify-center gap-2 items-center uppercase pt-14`}>
               {isGameStart ?<>{`Game starts in ${gameStartTimer}`}</> :<><BsCursorFill className="text-2xl" /> Click on this area to continue</> } 
            </div>
          }
                                                           {/* h-[156px] sm:h-[150px] used for below */}
          <div className={`flex justify-center items-center w-full ${!isEditing ? "blur overflow-hidden" : ""}`}>
          {isEditing && inputRef.current && !inputRef.current.contains(document.activeElement) &&
          <div className={`absolute flex w-full text-md font-semibold tracking-widest h-full justify-center gap-2 items-center uppercase pt-14`}>
             <h1>Click to focus again, timer is running!!</h1>
            </div>}
          <div className={` flex flex-wrap content-start w-full text-slate-500 p-6 font-medium font-mono text-lg sm:text-3xl tracking-wide select-none scrollbar-hide z-40 snap-y ${isEditing && inputRef.current && !inputRef.current.contains(document.activeElement) ? "blur overflow-hidden" : ""}`} ref={wordsMapParent} >
          <div className="flex w-full justify-between items-center max-w-7xl py-4">
            <h2 className=" text-xl sm:text-2xl text-start w-full font-bold">{INPUT_TEXT_WORDS_ARRAY[0] === "" ? 0 : INPUT_TEXT_WORDS_ARRAY.length} / {givenSentence?.split(" ").length}</h2>
            <h2 className=" text-xl sm:text-2xl text-end w-full font-bold">{"00:"}{timeElapsed < 10 ? `0${timeElapsed}` : timeElapsed}</h2>
          </div>
            {givenSentence?.split(" ").map((word, wordIndex) => {
              const EQUAL_INDEX_WORD_INPUT = INPUT_TEXT_WORDS_ARRAY.at(wordIndex);
              const EQUAL_INDEX_WORD_INPUT_OPPONENT = INPUT_TEXT_WORDS_ARRAY_OPPONENT?.at(wordIndex); // Opponent
              const defaultWord = word;
              if (EQUAL_INDEX_WORD_INPUT?.length > word.length) {
                word += EQUAL_INDEX_WORD_INPUT.slice(word.length);
              }
              return (
                <span key={`word_${word}_${wordIndex}`} className={`border-red-500 ${(INPUT_TEXT_WORDS_ARRAY?.length > wordIndex + 1 && EQUAL_INDEX_WORD_INPUT !== defaultWord) ? "border-b-2" : ""}`} >
                  {word.split("").map((letter, letterIndex) => {
                    const LETTER_ARRAY_OF_EQUAL_WORD = EQUAL_INDEX_WORD_INPUT?.split("");
                    const LETTER_ARRAY_OF_EQUAL_WORD_OPPONENT = EQUAL_INDEX_WORD_INPUT_OPPONENT?.split(""); // opponent
                    const InputLetterAtSameIndex = LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex);
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
                          <AnimatedCaret isOpponent={false} name={playerSelfName} isOnline={true}/>
                        </span>
                      }
                      {
                        isEditing &&
                        INPUT_TEXT_WORDS_ARRAY_OPPONENT?.length === wordIndex &&
                        letterIndex === 0 &&
                        opponentText.at(-1) === " " &&
                        <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={true} name={opponentName} isOnline={true}/>
                        </span>
                      }
                      {letterIndex === 0 &&
                       wordIndex === 0 &&
                       isEditing &&
                       text === "" &&
                      <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={false} name={playerSelfName} isOnline={true}/>
                        </span>}
                        {letterIndex === 0 &&
                       wordIndex === 0 &&
                       isEditing &&
                       opponentText === "" &&
                      <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={true} name={opponentName} isOnline={true}/>
                        </span>}
                      {letter}
                      {
                        LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex) !== undefined &&
                        letterIndex === LETTER_ARRAY_OF_EQUAL_WORD.length - 1 &&
                        INPUT_TEXT_WORDS_ARRAY.length === wordIndex + 1 &&
                        isEditing &&
                        text.at(-1) !== " " &&
                        <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={false} name={playerSelfName} isOnline={true}/>
                        </span>
                      }
                      {
                        LETTER_ARRAY_OF_EQUAL_WORD_OPPONENT?.at(letterIndex) !== undefined &&
                        letterIndex === LETTER_ARRAY_OF_EQUAL_WORD_OPPONENT.length - 1 &&
                        INPUT_TEXT_WORDS_ARRAY_OPPONENT.length === wordIndex + 1 &&
                        isEditing &&
                        opponentText.at(-1) !== " " &&
                        <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret isOpponent={true} name={opponentName} isOnline={true}/>
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
    </div>
    <Scoreboard isOpen={isOpen} onOpenChange={onOpenChange} result={result} />
    <ToastContainer 
      limit={1}
      />
    </>
  );
}
