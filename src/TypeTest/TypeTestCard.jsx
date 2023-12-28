import React from "react";
import {Card, CardFooter,CardHeader,CardBody, Image, Button,Spacer} from "@nextui-org/react";
import { useRouter } from "next/navigation"
import { GoClockFill } from "react-icons/go";
export default function TypeTestCard() {
  const router = useRouter();
  return (
    <Card 
      isPressable
      className="group threeDShadowLight rounded-[14px] md:rounded-[17px] transition-transform duration-500"
      css={{margin:0,padding:0}}
      onPress={()=> router.push("/typetest")}      >
    <CardBody className="overflow-visible relative transition-all duration-400">
      <Image
        alt="Card background"
        className="object-cover"
        id="gif"
        classNames={{
          img:"rounded-[10px] md:rounded-[13px] scale-[1.04] group-hover:scale-1 group-hover:rounded-b-sm transition ease-in duration-200"
        }}
        src="/TypeTest/TypeTestGif.gif"
        width={370}
      />
      <span className="group-hover:hidden flex absolute bottom-0 self-center font-black tracking-tighter text-3xl md:text-5xl z-10 -translate-y-4 opacity-20 sm:translate-x-1 transition-all duration-500 text-black"><h1>TypeTest</h1></span>
    </CardBody>
          <CardHeader className="hidden group-hover:flex pt-0 px-4 flex-col items-start transition-all ease-out duration-400">
            <h4 className="font-bold text-large">Type Test</h4>
            <p className="text-tiny uppercase font-bold">Solo</p>
            <div className="flex flex-row justify-between items-center w-full">
            <span className="flex flex-row items-center gap-1"><small className="text-default-500">1 v </small><GoClockFill className="text-xs mt-[1px] opacity-50"/></span>
            <small className="text-blue-500/80">Click/Tap to start</small>
            </div>
          </CardHeader>
  </Card>
  );
}
