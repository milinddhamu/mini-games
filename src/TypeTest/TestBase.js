"use client"


import { useRef,useState,useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import AnimatedCaret from './AnimatedCaret';
import {useTheme} from "next-themes";
export default function TestBase({sentence}){
  const { theme, setTheme } = useTheme()
  const [text, setText] = useState("");
  const [givenSentence , setGivenSentence] = useState(sentence);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
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

  const INPUT_TEXT_WORDS_ARRAY = text.trim().split(/\s+/);


  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  


  return (
    <>
    <div className="flex justify-center items-center h-screen w-screen" >
      <div className="relative test-base-area z-30 p-4" onClick={handleClick}>
        {!isEditing &&            
        <div className={`absolute flex h-[125px] sm:h-[150px] w-full max-w-7xl justify-center items-center ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`}>
          Click on this area to continue
        </div>
        }                                                 {/* h-[156px] sm:h-[150px] used for below */} 
      <div className={` flex flex-wrap  content-start h-[120px] sm:h-[130px] w-full max-w-7xl  text-pink-500 p-4 font-medium font-mono text-2xl sm:text-3xl tracking-wide select-none scrollbar-hide z-40 snap-y ${!isEditing ? "blur overflow-hidden" : "overflow-auto"}`} ref={wordsMapParent} >
        {givenSentence.split(" ").map((word, wordIndex) => {
          const EQUAL_INDEX_WORD = INPUT_TEXT_WORDS_ARRAY.at(wordIndex);
          const defaultWord = word;
          if (EQUAL_INDEX_WORD?.length > word.length) {
            word += EQUAL_INDEX_WORD.slice(word.length);
          }
          return (
            <span key={`word_${word}_${wordIndex}`} className={`${theme === "light" ? "border-black" : "border-white"} ${(INPUT_TEXT_WORDS_ARRAY?.length > wordIndex + 1 && EQUAL_INDEX_WORD !== defaultWord) ? "border-b-1" : ""} `} >
            {word.split("").map((letter, letterIndex) => {
              const LETTER_ARRAY_OF_EQUAL_WORD = EQUAL_INDEX_WORD?.split("");
              return (
                <span key={`letter_${wordIndex}_${letterIndex}_${letter}`} className={`${LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex) === undefined ? "text-pink-500" : LETTER_ARRAY_OF_EQUAL_WORD?.length <= letterIndex
                              ? "text-yellow-500"
                              : LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex) === letter
                              ? "text-green-500"
                              : LETTER_ARRAY_OF_EQUAL_WORD !== defaultWord.length && "text-yellow-500"}`}>
                  {letter === " " ? "\u00A0" : letter}
                    {(((LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex) !== undefined && letterIndex === LETTER_ARRAY_OF_EQUAL_WORD.length -1) && INPUT_TEXT_WORDS_ARRAY.length === wordIndex +1 ) && isEditing) && <span className={`absolute mt-[3px]`}><AnimatedCaret /></span>}
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
    </>
  );
}
