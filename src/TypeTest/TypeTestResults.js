import {Tooltip,Chip,Spacer} from "@nextui-org/react";
import { MdAutorenew,MdReplay  } from "react-icons/md";
import Counter from "./Counter";
import {memo} from "react"

const TypeTestResults = ({data,handleRestart,handleStartSame,type}) => {
  const resultMetrics = [
    { name: "Correct Words", data: data?.correctWords || 0,color:"success",textColor:"green"},
    { name: "Incorrect Words", data: data?.incorrectWords || 0,color:"danger",textColor:"red" },
    { name: "Skipped Words", data: data?.skippedWords || 0,color:"",textColor:"slate" },
    { name: "Extra Words", data: data?.extraWords || 0,color:"warning",textColor:"yellow" },
  ];

  const handleRestartSame = () => {
    handleStartSame(true);
    handleRestart();
  };
  const handleRestartNew = () => {
    handleStartSame(false);
    handleRestart();
  };
 
  return (
    <>
    <div className="flex flex-col justify-start items-center w-full gap-4 pt-14">
      <h1 className="text-xl font-bold uppercase text-start tracking-tightest opacity-80">{type !== undefined ?( type === "player" ? "Your Result" : "Opponent's Result") : "Results" }</h1>
      <div className="flex flex-col justify-center items-center w-full max-w-fit p-4 px-8 gap-4">
        <div className="flex flex-row w-full justify-center items-end gap-1">
          <Counter from={0} to={data?.wordsPerMinute || 0}/>
          <h1 className="text-3xl font-bold tracking-tightest">WPM</h1>

        </div>
        <h2 className="text-lg tracking-widest uppercase opacity-70">at {data?.accuracy || 0}{"%"} accuracy</h2>
        <div className="flex flex-row gap-4 items-center w-full">{resultMetrics.map((result , index)=>(
          <Tooltip 
          showArrow={true}
          placement="top"
          content={result.name}
          key={result.name}
          color={result.color}
          >
            <div className="flex flex-row items-baseline gap-4">
              <h1 className={`text-5xl font-bold uppercasetext opacity-70 hover:opacity-100 hover:cursor-pointer transition-all ease-out`}>{result?.data}</h1>
              {result.name !== "Extra Words" &&
              <span className="flex h-8 border-1 border-gray-500/50 opacity-50"></span> }
            </div>
          </Tooltip>
          ))}
        </div>



      </div>
      {type !== "opponent" &&
      <div className="flex flex-row items-center justify-center">
      <Tooltip 
      placement="top"
      content="Restart">
      <button onClick={handleRestartSame} className="p-10 group hover:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-500/50 via-black/0 to-black/0 rounded-full"><MdReplay className="text-5xl opacity-40 group-focus:opacity-60 group-hover:-rotate-12 group-focus:-rotate-12 transition-all ease-in duration-300"/>
      </button>
      </Tooltip>
      <Tooltip 
      placement="top"
      content="Start new">
      <button onClick={handleRestartNew} className="p-10 group hover:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-500/50 via-black/0 to-black/0 rounded-full"><MdAutorenew className="text-5xl opacity-40 group-focus:opacity-60 group-hover:rotate-12 group-focus:rotate-12 transition-all ease-in duration-300"/>
      </button>
      </Tooltip>
    </div> }
    </div>
    </>
  );
};

const arePropsEqual = (prevProps, nextProps) => {
  // Compare data objects
  return prevProps.data === nextProps.data;
};

const MemoizedTypeTestResults = memo(TypeTestResults, arePropsEqual);


export default MemoizedTypeTestResults;
