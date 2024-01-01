"use client"
import {useTheme} from "next-themes";
import TestBase from "@/TypeTest/TestBase";
import TestBaseOnline from "@/TypeTest/TestBaseOnline";
import { useState } from "react";
import {Switch} from "@nextui-org/react";
import {Tooltip} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";

export default function Home(){
  const { theme, setTheme } = useTheme();
  const [gameMode , setGameMode] = useState(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [gameRoomId , setGameRoomId] = useState(null);
  const [playerName , setPlayerName] = useState(null);
  const [onlineGameJoinOrCreate ,setOnlineGameJoinOrCreate ] = useState(true); // false for create room and true for join room
  const [currentAction, setCurrentAction] = useState('');

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
      <h1 className={`font-black px-4 uppercase text-center text-5xl lg:text-6xl xl:text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${theme === "dark" ? "from-white to-black" : "from-black to-white"} opacity-50`}>Type Test</h1>
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
    {gameMode === "offline" && <TestBase />}
    {gameMode === "online" && <TestBaseOnline playerName={playerName} gameRoomId={gameRoomId} currentAction={currentAction}/>}

    </div>  
  );
};