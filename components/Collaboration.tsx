"use client"; // Mark as a client component

import { motion } from "framer-motion";
import { Xmark } from "@/assets/icons"; 
import { useState } from "react";
import { useAppContext } from "../provider/AppStates";
import { v4 as uuid } from "uuid";
import { useRouter, useSearchParams } from "next/navigation"; // Updated import for App Router
import { socket } from "../api/socket";

interface CreateSessionProps {
  startSession: () => void;
}

interface SessionInfoProps {
  endSession: () => void;
}

interface CollabBoxProps {
  collabState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  children: React.ReactNode;
}

export const Collaboration = () => {
  const router = useRouter(); // App Router's useRouter
  const searchParams = useSearchParams(); // Hook to access URL search parameters
  const { session, setSession } = useAppContext();
  const [open, setOpen] = useState(false);
  const users = 0; // Assuming this value is updated elsewhere or is a placeholder

  const startSession = () => {
    const sessionId = uuid();
    
    // Construct new URL with 'room' query parameter
    const currentPathname = window.location.pathname;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('room', sessionId);
    
    // Use router.replace to update URL without full page reload
    router.replace(`${currentPathname}?${newSearchParams.toString()}`);
    
    setSession(sessionId);
    socket.emit("join", sessionId);
  };

  const endSession = () => {
    // Get current search parameters
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('room'); // Remove the 'room' parameter
    
    // Construct new URL without 'room' query parameter
    const currentPathname = window.location.pathname;
    const newUrl = newSearchParams.toString() ? `${currentPathname}?${newSearchParams.toString()}` : currentPathname;

    router.replace(newUrl); // Update URL
    
    socket.emit("leave", session);
    setSession(null);
    setOpen(false);
  };

  return (
    <div className="collaboration">
      <button
        data-users={users > 99 ? "99+" : users}
        type="button"
        className={`collaborateButton ${session ? "active" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open collaboration menu"
      >
        Share
      </button>

      {open && (
        <CollabBox collabState={[open, setOpen]}>
          {session ? (
            <SessionInfo endSession={endSession} />
          ) : (
            <CreateSession startSession={startSession} />
          )}
        </CollabBox>
      )}
    </div>
  );
};

const CreateSession: React.FC<CreateSessionProps> = ({ startSession }) => {
  return (
    <div className="collabCreate">
      <h2>Live collaboration</h2>
      <div>
        <p>Invite people to collaborate on your drawing.</p>
        <p>
          Don&apos;t worry, the session is end-to-end encrypted, and fully private.
          Not even our server can see what you draw.
        </p>
      </div>
      <button onClick={startSession}>Start session</button>
    </div>
  );
};

const SessionInfo: React.FC<SessionInfoProps> = ({ endSession }) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="collabInfo">
      <h2>Live collaboration</h2>

      <div className="collabGroup">
        <label htmlFor="collabUrl">Link</label>
        <div className="collabLink">
          <input
            id="collabUrl"
            type="url"
            value={window.location.href}
            disabled
            readOnly
          />
          <button type="button" onClick={copy}>
            Copy link
          </button>
        </div>
      </div>
      <div className="endCollab">
        <button type="button" onClick={endSession}>
          Stop session
        </button>
      </div>
    </div>
  );
};

const CollabBox: React.FC<CollabBoxProps> = ({ collabState, children }) => {
  const [isOpen, setIsOpen] = collabState;
  const exit = () => setIsOpen(false);

  return (
    <div className="collaborationContainer">
      <motion.div
        className="collaborationBoxBack"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={exit}
      />
      <motion.section
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15 }}
        className="collaborationBox"
      >
        <button onClick={exit} type="button" className="closeCollbBox" aria-label="Close collaboration menu">
          <Xmark />
        </button>

        {children}
      </motion.section>
    </div>
  );
};