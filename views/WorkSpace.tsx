import { useEffect } from "react";
import { Canvas } from "../components/Canvas";
import { Ui } from "../components/Ui";
import { useRouter } from "next/router";
import { useAppContext } from "../provider/AppStates";
import { socket } from "../api/socket";

export default function WorkSpace() {
  const { setSession } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const room: string | string[] | undefined = router.query.room;

    if (typeof room === "string") {
      setSession(room);
      socket.emit("join", room);
    }
  }, [router.query.room, setSession]);

  return (
    <>
      <Ui />
      <Canvas />
    </>
  );
}
