import { useState, useCallback } from "react";
import { socket } from "@/api/socket";

type SetStateAction<T> = T | ((prevState: T) => T);

export default function useHistory<T>(
  initialState: T,
  session: string | null = null
) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState<number>(0);

  const setState = useCallback(
    (action: SetStateAction<T>, overwrite = false, emit = true) => {
      const newState =
        typeof action === "function"
          ? (action as (prevState: T) => T)(history[index])
          : action;

      if (session) {
        if (action === "prevState") return;

        setHistory([newState]);
        setIndex(0);

        if (emit) {
          socket.emit("getElements", { elements: newState, room: session });
        }
        return;
      }

      if (action === "prevState") {
        if (index > 0) {
          const updatedState = [...history].slice(0, index);
          setHistory([...updatedState, history[index - 1]]);
          setIndex((prevState) => prevState - 1);
        }
        return;
      }

      if (overwrite) {
        const historyCopy = [...history];
        historyCopy[index] = newState;
        setHistory(historyCopy);
      } else {
        const updatedState = [...history].slice(0, index + 1);
        setHistory([...updatedState, newState]);
        setIndex((prevState) => prevState + 1);
      }
    },
    [history, index, session]
  );

  const undo = useCallback(() => {
    setIndex((prevState) => (prevState > 0 ? prevState - 1 : prevState));
  }, []);

  const redo = useCallback(() => {
    setIndex((prevState) =>
      prevState < history.length - 1 ? prevState + 1 : prevState
    );
  }, [history.length]);

  return [history[index], setState, undo, redo] as const;
}
