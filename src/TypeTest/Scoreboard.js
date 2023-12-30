"use client"
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue,Divider } from "@nextui-org/react";
import { useState,useEffect } from "react";

const Scoreboard = ({isOpen , onOpenChange,result}) => {
  const fetchDataFromLocal = () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('results')) || []
    } else {
      return []
    }
  }
  
  
  const [results, setResults] = useState(fetchDataFromLocal);

  useEffect(()=>{
    setResults(fetchDataFromLocal)
  },[result]);
  const columns = [
    "WPM",
    "Accuracy",
    "Words"
  ];
  const clearResults = () => {
    if (typeof window !== 'undefined') {
    localStorage?.removeItem('results');
    setResults([]);
  }};
  const displayedScore = [...results]?.reverse() || [];
  return (
    <Modal 
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: "py-6 ",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#000000] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-mono">Recent Scores</ModalHeader>
              <ModalBody>

                      <Table removeWrapper aria-label="Example table with dynamic content"
                        classNames={{
                          th:"bg-transparent text-lg font-mono font-semibold tracking-widest",
                          td:"font-mono text-md sm:text-lg"
                        }}
                          >
                            <TableHeader>
                              {columns.map((column) => (
                                <TableColumn key={column}>{column}</TableColumn>
                              ))}
                            </TableHeader>
                            <TableBody>
                              {displayedScore?.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell>{row?.wordsPerMinute || 0}</TableCell>
                                    <TableCell>{row?.accuracy || 0}{"%"}</TableCell>
                                      <TableCell>
                                        <span className="flex flex-row items-center gap-2">
                                        <h1 className="text-green-400">{row?.correctWords || 0}</h1>
                                        <span className="flex h-4 border-1 border-gray-500/50 opacity-50"></span>
                                        <h1 className="text-red-400">{row?.incorrectWords || 0}</h1>
                                        <span className="flex h-4 border-1 border-gray-500/50 opacity-50"></span>
                                        <h1 className="text-gray-400">{row?.skippedWords || 0}</h1>
                                        <span className="flex h-4 border-1 border-gray-500/50 opacity-50"></span>
                                        <h1 className="text-yellow-400">{row?.extraWords || 0}</h1>
                                        </span>
                                      </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          
              </ModalBody>
              <ModalFooter>
                <Button color="foreground" className="font-mono" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button className="bg-red-500 shadow-lg shadow-red-500/20 font-mono" onPress={clearResults}>
                  Reset
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}

export default Scoreboard;