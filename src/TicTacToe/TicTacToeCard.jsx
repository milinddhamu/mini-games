import React from "react";
import {Card, CardFooter,CardHeader,CardBody, Image, Button} from "@nextui-org/react";
import { useRouter } from "next/navigation"

export default function TicTacToeCard() {
  const router = useRouter();
  return (
    <Card 
      isPressable
      className="group threeDShadowLight rounded-[14px] md:rounded-[17px] transition-all duration-500"
      onPress={()=> router.push("/tictactoe")}
      >
    <CardBody className="overflow-hidden relative">
      <Image
        alt="Card background"
        className="object-cover"
        id="gif"
        classNames={{
          img:"rounded-[10px] md:rounded-[13px]  scale-[1.04] group-hover:scale-1 group-hover:rounded-b-sm transition-all ease-out duration-200"
        }}
        src="/TicTacToe/TicTacToeGif.gif"
        width={370}
      />
      <span className="group-hover:hidden flex absolute bottom-0 self-center font-black tracking-tighter text-3xl md:text-5xl z-10 -translate-y-4 opacity-20 sm:translate-x-1 transition-all duration-500 text-black"><h1>TicTacToe</h1></span>
    </CardBody>
          <CardHeader className="hidden opacity-0 group-hover:flex group-hover:opacity-100 pt-0 px-4 flex-col items-start transition-all ease-out duration-400">
            <h4 className="font-bold text-large">Tic Tac Toe</h4>
            <p className="text-tiny uppercase font-bold">Multiplayer , Online</p>
            <div className="flex flex-row justify-between items-center w-full">
            <small className="text-default-500">1 v 1</small>
            <small className="text-blue-500/80">Click/Tap to start</small>
            </div>
          </CardHeader>
  </Card>
  );
}
