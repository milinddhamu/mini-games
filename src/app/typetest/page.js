"use client"

import TestBase from "@/TypeTest/TestBase";
import TestBaseOnline from "@/TypeTest/TestBaseOnline";
import { useState } from "react";
import {Switch} from "@nextui-org/react";
import {Tooltip} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";

export default function Home(){
  
  const [gameMode , setGameMode] = useState(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [gameRoomId , setGameRoomId] = useState(null);
  const [playerName , setPlayerName] = useState(null);
  const [onlineGameJoinOrCreate ,setOnlineGameJoinOrCreate ] = useState(true); // false for create room and true for join room
  const [currentAction, setCurrentAction] = useState('');


  const sentence = "Nuclear power is the use of nuclear reactions to produce electricity. Nuclear power can be obtained from nuclear fission, nuclear decay and nuclear fusion reactions. Presently, the vast majority of electricity from nuclear power is produced by nuclear fission of uranium and plutonium in nuclear power plants.";

  const dataset = [
    "The quick brown fox, known for its remarkable agility and sly demeanor, effortlessly jumps over the lazy dog, showcasing the inherent beauty of nature and the harmony that exists between different creatures in the wild.",
    "Programming, a dynamic and ever-evolving field, is not just about writing code; it's a journey filled with intricate problem-solving, continuous learning, and the joy of creating innovative solutions that shape the digital world.",
    "Nature, with its vast landscapes, majestic mountains, and mesmerizing flora and fauna, is an endless source of wonders that captivates the human soul and reminds us of the delicate balance of life on Earth.",
    "The sky, adorned with a tapestry of hues ranging from cerulean blue to golden orange, is clear and radiant as the sun casts its warm beams, creating a picturesque scene that invokes a sense of tranquility and awe.",
    "Coffee, revered as the elixir of creativity and a staple for many programmers, is more than just a beverage; it's a ritual that provides the energy and focus needed to navigate the intricate world of coding and software development.",
    "Learning new things, whether it's acquiring new skills, exploring unfamiliar topics, or delving into uncharted territories, is a transformative journey that broadens your perspective and enriches the tapestry of your life.",
    "Music, with its enchanting melodies and harmonies, has the extraordinary power to transcend barriers, uplift your spirits, and evoke emotions that resonate deep within, creating a symphony of joy and introspection.",
    "Traveling, a pursuit of exploration and discovery, opens doors to a myriad of new experiences, cultures, and landscapes, providing a kaleidoscope of memories that shape your worldview and leave an indelible mark on your heart.",
    "Kindness, a universal language that transcends cultural differences and societal boundaries, is a beacon of light that fosters connection, empathy, and understanding among people from all walks of life.",
    "Books, with their pages brimming with the accumulated wisdom of generations, are a treasure trove of knowledge that invites you to embark on intellectual adventures, unlocking the secrets of the past and envisioning the possibilities of the future.",
  ];

  const shuffledDataset = dataset.sort(() => Math.random() - 0.5);
  const randomSentence = shuffledDataset.length > 0 ? shuffledDataset[0] : "";

  const handleCreateRoom = () => {
    setCurrentAction('create');
    setGameMode("online")
    // Additional logic for creating a room
  };

  const handleJoinRoom = () => {
    setCurrentAction('join');
    setGameMode("online")
    // Additional logic for joining a room
  };
  
  return (
    <div className="flex flex-col h-screen -mt-20 pt-20 w-full">
      <h1 className="font-black px-4 uppercase text-center text-3xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black to-white">Type Test</h1>
      {gameMode === null && 
        <div className="flex flex-col h-full justify-center  items-center gap-4 p-4 mt-16">
        <Tooltip color="success" content="Play with friend in a online-room">
        <Button color="success" variant="flat" className="text-lg font-extrabold tracking-widest p-8" size="lg" onPress={onOpen}>
        Online 1v1
        </Button>
        </Tooltip>

        <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        classNames={{
          closeButton: "scale-50 m-0 p-0",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {(onlineGameJoinOrCreate !== null) && <ModalHeader className="flex flex-col gap-1">{onlineGameJoinOrCreate === true && "Join Room" || onlineGameJoinOrCreate === false && "Create Room"}</ModalHeader>}
              <ModalBody>
                <div className="flex flex-row w-full gap-2">
              <Switch isSelected={onlineGameJoinOrCreate} color="danger" onValueChange={setOnlineGameJoinOrCreate}>
              </Switch>
              <p>Toggle Create or Join</p>  
              </div>
              {onlineGameJoinOrCreate === false &&
                <>
                <Input
                  autoFocus
                  label="Name"
                  placeholder="Enter your name"
                  variant="bordered"
                  value={playerName}
                  onValueChange={setPlayerName}
                />
                <Input
                  label="RoomId"
                  placeholder="Create room (4-6 letters only)"
                  variant="bordered"
                  value={gameRoomId}
                  onValueChange={setGameRoomId}
                />
                </>
             }
              {onlineGameJoinOrCreate === true &&
              <>
                <Input
                  autoFocus
                  label="Name"
                  placeholder="Enter your name"
                  variant="bordered"
                  value={playerName}
                  onValueChange={setPlayerName}
                />
                <Input
                  label="RoomId"
                  placeholder="Enter room id"
                  variant="bordered"
                  value={gameRoomId}
                  onValueChange={setGameRoomId}
                />
                </>
              }
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onPress={onlineGameJoinOrCreate ? handleJoinRoom : handleCreateRoom}>
                  {!onlineGameJoinOrCreate && "Create"}
                  {onlineGameJoinOrCreate && "Join"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Tooltip color="danger" placement="bottom" content="Play both players in a single screen">
        <Button color="danger" variant="flat" className="font-bold tracking-widest p-6" size="lg" onPress={()=> setGameMode("offline")}>
        Local 1v1
        </Button>
        </Tooltip>    
        </div>
        }
    {gameMode === "offline" && <TestBase sentence={randomSentence}/>}
    {gameMode === "online" && <TestBaseOnline sentence={randomSentence} playerName={playerName} gameRoomId={gameRoomId} currentAction={currentAction}/>}
    </div>  
  );
};