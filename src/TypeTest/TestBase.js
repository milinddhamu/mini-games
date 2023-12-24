"use client"
import { useRef,useState,useEffect } from 'react';
import AnimatedCaret from './AnimatedCaret';
const TestBase = ({sentence}) => {
  const [text, setText] = useState("");
  const [margin, setMargin] = useState(4);
  const [isEditing, setIsEditing] = useState(true);
  const inputRef = useRef(null);
  const caretRef = useRef(null); 
  console.log(isEditing)
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
      <div className="relative z-30" onClick={handleClick}>
        {!isEditing &&
        <div className='absolute m-4 flex h-[156px] sm:h-[150px] w-full max-w-6xl justify-center items-center'>
          Click on this area to continue
        </div>
        }
      <div className={` flex flex-wrap gap-2 content-start  w-full max-w-6xl max-h-fit h-[156px] sm:h-[150px] text-pink-500/50 p-4 font-medium font-mono text-xl sm:text-3xl text-center tracking-wide m-4 select-none scrollbar-hide z-40 ${!isEditing ? "blur overflow-hidden" : "overflow-auto"}`} >
        
        {sentence.split(" ").map((word, wordIndex) => {
          const EQUAL_INDEX_WORD = INPUT_TEXT_WORDS_ARRAY.at(wordIndex);
          if (EQUAL_INDEX_WORD?.length > word.length) {
            word += EQUAL_INDEX_WORD.slice(word.length);
          }
          
          return (
          <span key={`word_${word}_${wordIndex}`} className={` ${INPUT_TEXT_WORDS_ARRAY?.length > wordIndex + 1 && EQUAL_INDEX_WORD !== word ? "border-b-2" : ""} `}>
            {word.split("").map((letter, letterIndex) => {
              const LETTER_ARRAY_OF_EQUAL_WORD = EQUAL_INDEX_WORD?.split("");
              return (
                <>
                <span key={`letter_${wordIndex}_${letterIndex}_${letter}`} className={`${LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex) === undefined ? "text-pink-500/50" : LETTER_ARRAY_OF_EQUAL_WORD?.length <= letterIndex
                              ? "text-red-500"
                              : LETTER_ARRAY_OF_EQUAL_WORD?.at(letterIndex) === letter
                              ? "text-white"
                              : "text-red-500"}`}>
                  {letter === " " ? "\u00A0" : letter}
                </span>
                </>
              );
            })}
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

export default TestBase;