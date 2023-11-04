import React from "react";
import {Card, CardFooter,CardHeader,CardBody, Image, Button} from "@nextui-org/react";
import { useRouter } from "next/navigation"

export default function TicTacToeCard() {
  const router = useRouter();
  return (
    <Card 
      isPressable
      className="py-1"
      onPress={()=> router.push("/tictactoe")}
      >
    <CardHeader className="pb-0 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Tic Tac Toe</h4>
      <p className="text-tiny uppercase font-bold">Multiplayer</p>
      <small className="text-default-500">1 v 1</small>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <Image
        alt="Card background"
        className="object-cover"
        id="gif"
        classNames={{
          img:"!rounded"
        }}
        src="/TicTacToe/TicTacToeGif.gif"
        width={270}
      />
    </CardBody>
  </Card>
  );
}
