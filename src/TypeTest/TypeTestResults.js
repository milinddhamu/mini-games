"use client"
import { TiRefresh } from "react-icons/ti";
import {Tooltip,Chip} from "@nextui-org/react";
import {useRef,useEffect} from "react";
import { animate } from "framer-motion";
export default function TypeTestResults({data,handleRestart}){
  const resultMetrics = [
    { name: "Correct Words", data: data?.correctWords || 0,color:"success",textColor:"green"},
    { name: "Incorrect Words", data: data?.incorrectWords || 0,color:"danger",textColor:"red" },
    { name: "Skipped Words", data: data?.skippedWords || 0,color:"",textColor:"slate" },
    { name: "Extra Words", data: data?.extraWords || 0,color:"warning",textColor:"yellow" },
  ];
  function handleReplace(){
    window.location.reload()
  };

  function Counter({ from, to }) {
    const nodeRef = useRef();

    useEffect(() => {
      const node = nodeRef.current;

      const controls = animate(from, to, {
        duration: 1,
        onUpdate(value) {
          node.textContent = value.toFixed();
        }
      });

      return () => controls.stop();
    }, []);

    return <p className="font-black text-9xl"
      ref={nodeRef} />;
  }
  
  return (
    <>
    <div className="flex flex-col justify-center items-center w-full gap-4 pt-6">
      <h1 className="text-3xl font-bold uppercase text-start tracking-tightest opacity-80">Results</h1>
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
      <div className="flex flex-col items-center">
      <Tooltip 
      placement="bottom"
      content="Start over">
      <button onClick={handleRestart} className="px-10 py-8 m-8 border-1 border-gray-500/50 group"><TiRefresh  className="text-5xl opacity-40 group-focus:opacity-60 group-focus:rotate-45 transition-all ease-in duration-150"/>
      </button>
      </Tooltip>
      <Chip size="sm">Press tab + enter to restart</Chip>

    </div>
    </div>
    </>
  )
}