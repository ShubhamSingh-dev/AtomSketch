import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppContext } from "../provider/AppStates";
import useDimension from "./useDimension";
import { lockUI } from "../helper/ui";
import {
  draw,
  drawFocuse,
  cornerCursor,
  inSelectedCorner,
} from "../helper/canvas";
import {
  adjustCoordinates,
  arrowMove,
  createElement,
  deleteElement,
  duplicateElement,
  getElementById,
  getElementPosition,
  minmax,
  resizeValue,
  saveElements,
  updateElement,
  uploadElements,
  Element, // Imported Element interface
} from "../helper/elements";
import useKeys from "./useKeys";
import React from "react"; // Import React for MouseEvent, WheelEvent, KeyboardEvent

// Define types for your elements based on their properties
// This is a minimal example, you should expand it to match your actual element structure
// Already defined in helper/elements.ts, importing it.
// interface Element {
//   id: string;
//   x1: number;
//   y1: number;
//   x2: number;
//   y2: number;
//   type: string;
//   // Add other properties like 'stroke', 'fillStyle', etc.
//   [key: string]: any;
// }

interface SelectedElement extends Element {
  offsetX: number;
  offsetY: number;
}

interface CornerInfo {
  slug: string;
  [key: string]: any;
}

interface TranslateState {
  x: number;
  y: number;
  sx: number;
  sy: number;
}

interface MouseActionState {
  x: number;
  y: number;
}

// Custom type for setElements action to include "prevState" string literal
type SetElementsAction =
  | Element[]
  | ((prevState: Element[]) => Element[])
  | "prevState";

interface ScaleOffsetState {
  x: number;
  y: number;
}

export default function useCanvas() {
  const {
    selectedTool,
    setSelectedTool,
    action,
    setAction,
    elements,
    setElements,
    scale,
    onZoom,
    translate,
    setTranslate,
    scaleOffset,
    setScaleOffset,
    lockTool,
    style,
    selectedElement,
    setSelectedElement,
    undo,
    redo,
    session,
  } = useAppContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const dimension = useDimension();
  const [isInElement, setIsInElement] = useState<boolean>(false);
  const [inCorner, setInCorner] = useState<CornerInfo | null>(null);
  const [padding, setPadding] = useState<number>(minmax(10 / scale, [0.5, 50]));
  const [cursor, setCursor] = useState<string>("default");
  const [mouseAction, setMouseAction] = useState<MouseActionState>({
    x: 0,
    y: 0,
  });
  const [resizeOldDimensions, setResizeOldDimensions] =
    useState<Element | null>(null); // Corrected typo

  const mousePosition = ({
    clientX,
    clientY,
  }: React.MouseEvent<HTMLCanvasElement>): {
    clientX: number;
    clientY: number;
  } => {
    clientX = (clientX - translate.x * scale + scaleOffset.x) / scale;
    clientY = (clientY - translate.y * scale + scaleOffset.y) / scale;
    return { clientX, clientY };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = mousePosition(event);
    lockUI(true);

    if (inCorner && selectedElement) {
      // Added null check for selectedElement
      setResizeOldDimensions(
        getElementById(selectedElement.id, elements) as Element
      );
      setElements((prevState: Element[]) => prevState); // Correct type for setState callback
      setMouseAction({ x: event.clientX, y: event.clientY });
      setCursor(cornerCursor(inCorner.slug));
      setAction(
        "resize-" + inCorner.slug + (event.shiftKey ? "-shiftkey" : "")
      );
      return;
    }

    if (keys.has(" ") || selectedTool === "hand" || event.button === 1) {
      // Changed == to ===
      setTranslate((prevState: TranslateState) => ({
        ...prevState,
        sx: clientX,
        sy: clientY,
      }));
      setAction("translate");
      return;
    }

    if (selectedTool === "selection") {
      // Changed == to ===
      const element = getElementPosition(clientX, clientY, elements); // Type Element | undefined

      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;

        if (event.altKey) {
          duplicateElement(element, setElements, setSelectedElement, 0, {
            offsetX,
            offsetY,
          });
        } else {
          setElements((prevState: Element[]) => prevState); // Correct type for setState callback
          setSelectedElement({ ...element, offsetX, offsetY }); // Explicitly cast to SelectedElement
        }
        setAction("move");
      } else {
        setSelectedElement(null);
      }

      return;
    }

    setAction("draw");

    const element = createElement(
      clientX,
      clientY,
      clientX,
      clientY,
      style,
      selectedTool
    );
    setElements((prevState: Element[]) => [...prevState, element]); // Correct type for setState callback
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = mousePosition(event);

    if (selectedElement) {
      setInCorner(
        inSelectedCorner(
          getElementById(selectedElement.id, elements) as Element, // Ensure Element type
          clientX,
          clientY,
          padding,
          scale
        )
      );
    }

    if (getElementPosition(clientX, clientY, elements)) {
      setIsInElement(true);
    } else {
      setIsInElement(false);
    }

    if (action === "draw") {
      // Changed == to ===
      const lastElement = elements.at(-1); // lastElement could be undefined
      if (lastElement) {
        // Added null check
        const { id } = lastElement;
        updateElement(
          id,
          { x2: clientX, y2: clientY },
          setElements,
          elements,
          true
        );
      }
    } else if (action === "move") {
      // Changed == to ===
      if (selectedElement) {
        // Added null check
        const { id, x1, y1, x2, y2, offsetX, offsetY } = selectedElement;

        const width = x2 - x1;
        const height = y2 - y1;

        const nx = clientX - offsetX;
        const ny = clientY - offsetY;

        updateElement(
          id,
          { x1: nx, y1: ny, x2: nx + width, y2: ny + height },
          setElements,
          elements,
          true
        );
      }
    } else if (action === "translate") {
      // Changed == to ===
      const x = clientX - translate.sx;
      const y = clientY - translate.sy;

      setTranslate((prevState: TranslateState) => ({
        ...prevState,
        x: prevState.x + x,
        y: prevState.y + y,
      }));
    } else if (
      action.startsWith("resize") &&
      selectedElement &&
      resizeOldDimensions
    ) {
      // Added null checks
      const resizeCorner = action.slice(7, 9);
      const resizeType = action.slice(10) || "default";
      const s_element = getElementById(selectedElement.id, elements) as Element;

      updateElement(
        s_element.id,
        resizeValue(
          resizeCorner,
          resizeType,
          clientX,
          clientY,
          padding,
          s_element,
          mouseAction,
          resizeOldDimensions
        ),
        setElements,
        elements,
        true
      );
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setAction("none");
    lockUI(false);

    if (event.clientX === mouseAction.x && event.clientY === mouseAction.y) {
      // Changed == to ===
      setElements("prevState"); // Special string literal for useHistory
      return;
    }

    if (action === "draw") {
      // Changed == to ===
      const lastElement = elements.at(-1); // lastElement could be undefined
      if (lastElement) {
        // Added null check
        const { id, x1, y1, x2, y2 } = adjustCoordinates(lastElement);
        updateElement(id, { x1, x2, y1, y2 }, setElements, elements, true);
        if (!lockTool) {
          setSelectedTool("selection");
          setSelectedElement(lastElement);
        }
      }
    }

    if (action.startsWith("resize") && selectedElement) {
      // Added null check
      const adjustedElement = getElementById(selectedElement.id, elements);
      if (adjustedElement) {
        // Added null check
        const { id, x1, y1, x2, y2 } = adjustCoordinates(adjustedElement);
        updateElement(id, { x1, x2, y1, y2 }, setElements, elements, true);
      }
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (event.ctrlKey) {
      onZoom(event.deltaY * -0.01);
      return;
    }

    setTranslate((prevState: TranslateState) => ({
      ...prevState,
      x: prevState.x - event.deltaX,
      y: prevState.y - event.deltaY,
    }));
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const zoomPositionX = 2;
    const zoomPositionY = 2;

    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;

    const scaleOffsetX = (scaledWidth - canvas.width) / zoomPositionX;
    const scaleOffsetY = (scaledHeight - canvas.height) / zoomPositionY;

    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();

    context.translate(
      translate.x * scale - scaleOffsetX,
      translate.y * scale - scaleOffsetY
    );
    context.scale(scale, scale);

    let focusedElement: Element | null = null;
    elements.forEach((element: Element) => {
      draw(element, context);
      if (element.id === selectedElement?.id) focusedElement = element; // Changed == to ===
    });

    const pd = minmax(10 / scale, [0.5, 50]);
    if (focusedElement != null) {
      drawFocuse(focusedElement, context, pd, scale);
    }
    setPadding(pd);

    context.restore();
  }, [elements, selectedElement, scale, translate, dimension, setScaleOffset]);

  useEffect(() => {
    const keyDownFunction = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey } = event;
      const prevent = () => event.preventDefault();

      if (selectedElement) {
        if (key === "Backspace" || key === "Delete") {
          // Changed == to ===
          prevent();
          deleteElement(selectedElement, setElements, setSelectedElement);
        }

        if (ctrlKey && key.toLowerCase() === "d") {
          // Changed == to ===
          prevent();
          duplicateElement(
            selectedElement,
            setElements,
            setSelectedElement,
            10
          );
        }

        if (key === "ArrowLeft") {
          // Changed == to ===
          prevent();
          arrowMove(selectedElement, -1, 0, setElements);
        }
        if (key === "ArrowUp") {
          // Changed == to ===
          prevent();
          arrowMove(selectedElement, 0, -1, setElements);
        }
        if (key === "ArrowRight") {
          // Changed == to ===
          prevent();
          arrowMove(selectedElement, 1, 0, setElements);
        }
        if (key === "ArrowDown") {
          // Changed == to ===
          prevent();
          arrowMove(selectedElement, 0, 1, setElements);
        }
      }

      if (ctrlKey || metaKey) {
        if (
          key.toLowerCase() === "y" || // Changed == to ===
          (key.toLowerCase() === "z" && shiftKey) // Changed == to ===
        ) {
          prevent();
          redo();
        } else if (key.toLowerCase() === "z") {
          // Changed == to ===
          prevent();
          undo();
        } else if (key.toLowerCase() === "s") {
          // Changed == to ===
          prevent();
          saveElements(elements);
        } else if (key.toLowerCase() === "o") {
          // Changed == to ===
          prevent();
          uploadElements(setElements as (elements: Element[]) => void); // Cast for uploadElements
        }
      }
    };

    window.addEventListener("keydown", keyDownFunction, { passive: false });
    return () => {
      window.removeEventListener("keydown", keyDownFunction);
    };
  }, [
    undo,
    redo,
    selectedElement,
    setElements,
    setSelectedElement,
    elements,
    session,
  ]); // Added missing dependencies

  useEffect(() => {
    if (selectedTool !== "selection") {
      setSelectedElement(null);
    }
  }, [selectedTool, setSelectedElement]);

  useEffect(() => {
    if (action === "translate") {
      // Changed == to ===
      document.documentElement.style.setProperty("--canvas-cursor", "grabbing");
    } else if (action.startsWith("resize")) {
      document.documentElement.style.setProperty("--canvas-cursor", cursor);
    } else if (
      (keys.has(" ") || selectedTool === "hand") && // Changed == to ===
      action !== "move" && // Changed != to !==
      action !== "resize" // Changed != to !==
    ) {
      document.documentElement.style.setProperty("--canvas-cursor", "grab");
    } else if (selectedTool !== "selection") {
      document.documentElement.style.setProperty(
        "--canvas-cursor",
        "crosshair"
      );
    } else if (inCorner) {
      document.documentElement.style.setProperty(
        "--canvas-cursor",
        cornerCursor(inCorner.slug)
      );
    } else if (isInElement) {
      document.documentElement.style.setProperty("--canvas-cursor", "move");
    } else {
      document.documentElement.style.setProperty("--canvas-cursor", "default");
    }
  }, [keys, selectedTool, action, isInElement, inCorner, cursor]);

  useEffect(() => {
    const fakeWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", fakeWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", fakeWheel);
    };
  }, []);

  return {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    dimension,
  };
}
