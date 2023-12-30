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

export default function TestBase() {
  const { theme, setTheme } = useTheme();
  const [text, setText] = useState("");
  const [givenSentence, setGivenSentence] = useState(()=>{
    const shuffledDataset = dataset.sort(() => Math.random() - 0.5);
    const randomSentence = shuffledDataset.length > 0 ? shuffledDataset[0] : "";
    return randomSentence
  });
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [isSameTest, setIsSameTest] = useState(null);
  const [wordsMapParent] = useAutoAnimate(/* optional config */);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const handleBlur = (e) => {
    e.preventDefault();
    setIsEditing(false)
  };
  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = () => {
    !isEditing && setIsEditing(true);
    if (inputRef.current) {
      inputRef.current.focus();
    };
    if(isSameTest !== null){
      setIsSameTest(null);
    }
  };

  const INPUT_TEXT_WORDS_ARRAY = text?.trim().split(/\s+/) || [];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    let timer;
    if (isEditing && timeElapsed <= 15) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isEditing]);

  useEffect(() => {
    if (timeElapsed === 15) {
      const results = calculateResults(givenSentence, text, timeElapsed);
      setResult(results);
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
  
  const handleRestart = () => {
    if(showResults){
      setShowResults(false)
      setText("");
      setTimeElapsed(0);
      setResult(null);
      setIsSameTest(null);
    };
    
  };

  useEffect(() => {
    if (!showResults && result === null) {
      const shuffledDataset = dataset.sort(() => Math.random() - 0.5);
      const randomSentence = shuffledDataset.length > 0 ? shuffledDataset[0] : "";
      
      if (!isSameTest) {
        setGivenSentence(randomSentence);
      }

      handleClick();
    }
  }, [isSameTest, showResults, result]);
  
  useEffect(()=>{
    if(result){
      const storedResults = JSON.parse(localStorage.getItem('results')) || [];
      storedResults.push(result);

      // Keep only the last 5 results
      const lastFiveResults = storedResults.slice(-10);

      // Update localStorage with the last 5 results
      localStorage.setItem('results', JSON.stringify(lastFiveResults));
    }
  },[result]);

  return (
    <>
        <div className="flex flex-col justify-center items-center w-full h-full relative" >
        {!isEditing && <div className="absolute flex w-full justify-center p-4 top-5">
          <button onClick={onOpen} id="Scoreboard">
          <h1 className="text-violet-400/70 hover:text-violet-400 hover:underline hover:curor-pointer font-mono text-xl font-bold transition-all">Recent Scores &#x1F6C8;</h1>
          </button>
        </div>}
      {
      showResults ?
      <MemoizedTypeTestResults data={result} handleRestart={handleRestart} handleStartSame={setIsSameTest} /> :
        <div className="relative test-base-area max-w-7xl z-30 hover:cursor-pointer" onClick={handleClick}>
          {!isEditing &&
            <div className={`absolute flex w-full text-md font-semibold tracking-widest h-full justify-center gap-2 items-center uppercase pt-14`}>
              <BsCursorFill className="text-2xl" /> Click on this area to continue 
            </div>
          }
                                                           {/* h-[156px] sm:h-[150px] used for below */}
          <div className="flex justify-center items-center w-full">
          <div className={` flex flex-wrap content-start w-full text-slate-500 p-6 font-medium font-mono text-lg sm:text-3xl tracking-wide select-none scrollbar-hide z-40 snap-y ${!isEditing ? "blur overflow-hidden" : ""}`} ref={wordsMapParent} >
          <div className="flex w-full justify-between items-center max-w-7xl py-4">
            <h2 className=" text-xl sm:text-2xl text-start w-full font-bold">{INPUT_TEXT_WORDS_ARRAY[0] === "" ? 0 : INPUT_TEXT_WORDS_ARRAY.length} / {givenSentence?.split(" ").length}</h2>
            <h2 className=" text-xl sm:text-2xl text-end w-full font-bold">{"00:"}{timeElapsed < 10 ? `0${timeElapsed}` : timeElapsed}</h2>
          </div>
            {givenSentence?.split(" ").map((word, wordIndex) => {
              const EQUAL_INDEX_WORD_INPUT = INPUT_TEXT_WORDS_ARRAY.at(wordIndex);
              const defaultWord = word;
              if (EQUAL_INDEX_WORD_INPUT?.length > word.length) {
                word += EQUAL_INDEX_WORD_INPUT.slice(word.length);
              }
              return (
                <span key={`word_${word}_${wordIndex}`} className={`border-red-500 ${(INPUT_TEXT_WORDS_ARRAY?.length > wordIndex + 1 && EQUAL_INDEX_WORD_INPUT !== defaultWord) ? "border-b-2" : ""}`} >
                  {word.split("").map((letter, letterIndex) => {
                    const LETTER_ARRAY_OF_EQUAL_WORD = EQUAL_INDEX_WORD_INPUT?.split("");
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
                          <AnimatedCaret />
                        </span>
                      }
                      {letterIndex === 0 &&
                       wordIndex === 0 &&
                       isEditing &&
                       text === "" &&
                      <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret />
                        </span>}
                      {letter}
                      {
                        LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex) !== undefined &&
                        letterIndex === LETTER_ARRAY_OF_EQUAL_WORD.length - 1 &&
                        INPUT_TEXT_WORDS_ARRAY.length === wordIndex + 1 &&
                        isEditing &&
                        text.at(-1) !== " " &&
                        <span className={`absolute mt-[3px]`}>
                          <AnimatedCaret />
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
    </>
  );
}
