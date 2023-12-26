import React from "react";
import {Card, CardFooter,CardHeader,CardBody, Image, Button} from "@nextui-org/react";
import { useRouter } from "next/navigation"

export default function TypeTestCard() {
  const router = useRouter();
  return (
    <Card 
      isPressable
      className="py-1"
      onPress={()=> router.push("/typetest")}      >
    <CardHeader className="pb-0 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Type Test</h4>
      <p className="text-tiny uppercase font-bold">Multiplayer , Online</p>
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
        src="/TypeTest/TypeTestGif.gif"
        width={370}
      />
    </CardBody>
  </Card>
  );
}
