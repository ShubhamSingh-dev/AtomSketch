// views/WorkSpace.tsx
"use client";

import { useEffect } from "react";
import { Canvas } from "../components/Canvas";
import { Ui } from "../components/Ui";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "../provider/AppStates";
import { socket } from "../api/socket";

export default function WorkSpace() {
  const { setSession } = useAppContext();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Add 'no-scroll' class to body when this component mounts (on /canvas route)
    document.body.classList.add("no-scroll");

    // Clean up: remove 'no-scroll' class when this component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []); // Empty dependency array means this runs once on mount and once on unmount

  useEffect(() => {
    const room: string | null = searchParams.get("room");

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
