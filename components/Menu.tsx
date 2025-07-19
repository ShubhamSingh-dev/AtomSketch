import { useState } from "react";
import { Delete, Download, Folder, MenuIcon, Xmark } from "@/assets/icons";
import { useAppContext } from "../provider/AppStates";
import { saveElements, uploadElements } from "../helper/elements";
import { Element } from "../helper/elements";
import React from "react";

// Define an interface for MenuBox props
interface MenuBoxProps {
  elements: Element[];
  setElements: (
    elements: Element[] | ((prevElements: Element[]) => Element[])
  ) => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Menu() {
  const { elements, setElements } = useAppContext();
  const [show, setShow] = useState(false);

  return (
    <div className="menu">
      <button
        className="menuBtn"
        type="button"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <Xmark /> : <MenuIcon />}
      </button>

      {show && (
        <MenuBox
          elements={elements}
          setElements={setElements}
          setShow={setShow}
        />
      )}
    </div>
  );
}

// Apply the MenuBoxProps interface to the MenuBox functional component
function MenuBox({ elements, setElements, setShow }: MenuBoxProps) {
  const uploadJson = () => uploadElements(setElements);
  const downloadJson = () => saveElements(elements);
  const reset = () => setElements([]);
  return (
    <>
      <div className="menuBlr" onClick={() => setShow(false)}></div>
      <section className="menuItems">
        <button className="menuItem" type="button" onClick={uploadJson}>
          <Folder /> <span>Open</span>
        </button>
        <button className="menuItem" type="button" onClick={downloadJson}>
          <Download /> <span>Save</span>
        </button>
        <button className="menuItem" type="button" onClick={reset}>
          <Delete /> <span>Reset the canvas</span>
        </button>
      </section>
    </>
  );
}
