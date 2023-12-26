"use client"


import { useRef, useState, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import AnimatedCaret from './AnimatedCaret';
import { useTheme } from "next-themes";
import { PiCursorClick } from "react-icons/pi";
import TypeTestResults from "./TypeTestResults"
export default function TestBase({ sentence }) {
  const { theme, setTheme } = useTheme()
  const [text, setText] = useState("");
  const [givenSentence, setGivenSentence] = useState(sentence);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [wordsMapParent] = useAutoAnimate(/* optional config */)

  const handleBlur = (e) => {
    // Prevent the input from losing focus
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
    if (timeElapsed === 15) {
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
        <h2 className=" text-2xl text-end w-full px-4 font-bold">{"00:"}{timeElapsed < 10 ? `0${timeElapsed}` : timeElapsed}</h2>
        </div>
        <div className="relative test-base-area z-30 p-4" onClick={handleClick}>
          {!isEditing &&
            <div className={`absolute flex w-full max-w-7xl text-xl font-semibold tracking-widest h-full justify-center items-center ${theme === "dark" ? "bg-black/10" : "bg-white/10"} uppercase`}>
              Click on this area to continue <PiCursorClick className="mx-4 text-3xl" />
            </div>
          }                                                 {/* h-[156px] sm:h-[150px] used for below */}
          <div className={` flex flex-wrap content-start w-full max-w-7xl  text-slate-500 p-4 font-medium font-mono text-2xl sm:text-3xl tracking-wide select-none scrollbar-hide z-40 snap-y ${!isEditing ? "blur overflow-hidden" : ""}`} ref={wordsMapParent} >
            {givenSentence.split(" ").map((word, wordIndex) => {
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
    </>
  );
}
