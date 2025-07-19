"use client";

import { useEffect } from "react";
import { Canvas } from "../components/Canvas";
import { Ui } from "../components/Ui";
import { useSearchParams } from "next/navigation"; // Changed from useRouter to useSearchParams
import { useAppContext } from "../provider/AppStates";
import { socket } from "../api/socket";

export default function WorkSpace() {
  const { setSession } = useAppContext();
  const searchParams = useSearchParams(); 

  useEffect(() => {
    
    const room: string | null = searchParams.get('room');

    if (typeof room === "string") {
      setSession(room);
      socket.emit("join", room);
    }
  }, [searchParams, setSession]); 

  return (
    <>
      <Ui />
      <Canvas />
    </>
  );
}