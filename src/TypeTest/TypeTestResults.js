
import { TiRefresh } from "react-icons/ti";
import {Tooltip} from "@nextui-org/react";

export default function TypeTestResults({data}){
  const resultMetrics = [
    { name: "Words Per Minute", data: data?.wordsPerMinute || 0 },
    { name: "Correct Words", data: data?.correctChars || 0 },
    { name: "Incorrect Words", data: data?.incorrectChars || 0 },
    { name: "Skipped Words", data: data?.skippedChars || 0 },
    { name: "Extra Words", data: data?.extraChars || 0 },
    { name: "Accuracy", data: data?.extraChars || 0 },
  ];

  function handleReplace(){
    window.location.reload()
  };
  return (
    <>
    <div className="flex flex-col justify-center items-center w-full gap-4 h-screen">
      <div className="flex flex-col justify-center items-center w-full  max-w-7xl p-4 gap-6">
        <h1 className="text-3xl font-bold uppercase text-start ">Results:</h1>
        <div className="flex flex-col items-center gap-2 w-full">{resultMetrics.map((result , index)=>(
          <span key={name}><h2 className="text-xl font-medium uppercase "><span className="text-2xl font-bold">{result.data}</span> - {result.name}</h2></span>
          ))}
        </div>
      </div>
      <Tooltip 
      placement="bottom"
      content={
        <h1 className="p-2">Start over</h1>
      }>
      <button onClick={handleReplace} className="p-6 group"><TiRefresh  className="text-5xl opacity-40 group-hover:opacity-60 group-hover:rotate-45 transition-all ease-in duration-150"/>
      </button>
      </Tooltip>
    </div>
    </>
  )
}