
import TestBase from "@/TypeTest/TestBase";

export default function Home(){
  const sentence = "Nuclear power is the use of nuclear reactions to produce electricity. Nuclear power can be obtained from nuclear fission, nuclear decay and nuclear fusion reactions. Presently, the vast majority of electricity from nuclear power is produced by nuclear fission of uranium and plutonium in nuclear power plants.";
  
  return (  
    <TestBase sentence={sentence}/>
  );
};