import {
  Backward,
  Delete,
  Duplicate,
  Forward,
  ToBack,
  ToFront,
} from "@/assets/icons";
import { useAppContext } from "@/provider/AppStates";
import { BACKGROUND_COLORS, STROKE_COLORS, STROKE_STYLES } from "../global/var";
import {
  Element,
  updateElement,
  moveElementLayer,
  deleteElement,
  duplicateElement,
  minmax,
} from "@/helper/elements"; // Import from your existing elements file
import React, { useEffect, useState } from "react";

// Type definitions for props
interface StyleProps {
  selectedElement: Element | null;
}

// Type for the local element style state
interface ElementStyle {
  fill: string;
  strokeWidth: number;
  strokeStyle: string;
  strokeColor: string;
  opacity: number;
}

// Type for style updates
interface StyleUpdate {
  fill?: string;
  strokeWidth?: number;
  strokeStyle?: string;
  strokeColor?: string;
  opacity?: number;
}

// Type for stroke style objects
interface StrokeStyle {
  slug: string;
  icon: React.ComponentType;
}

export function Style({ selectedElement }: StyleProps) {
  const { elements, setElements, setSelectedElement, setStyle } =
    useAppContext();

  const [elementStyle, setElementStyle] = useState<ElementStyle>({
    fill: selectedElement?.fill || "",
    strokeWidth: selectedElement?.strokeWidth || 1,
    strokeStyle: selectedElement?.strokeStyle || "",
    strokeColor: selectedElement?.strokeColor || "",
    opacity: selectedElement?.opacity || 100,
  });

  useEffect(() => {
    if (selectedElement) {
      setElementStyle({
        fill: selectedElement.fill || "",
        strokeWidth: selectedElement.strokeWidth,
        strokeStyle: selectedElement.strokeStyle || "",
        strokeColor: selectedElement.strokeColor || "",
        opacity: selectedElement.opacity || 100,
      });
    }
  }, [selectedElement]);

  const setStylesStates = (styleObject: StyleUpdate) => {
    setElementStyle((prevState) => ({ ...prevState, ...styleObject }));
    setStyle((prevState: StyleUpdate) => ({ ...prevState, ...styleObject }));
  };

  // Helper function to match your updateElement signature
  const updateElementHelper = (
    id: string,
    updates: Partial<Element>,
    setElementsFunc: React.Dispatch<React.SetStateAction<Element[]>>,
    elementsArray: Element[]
  ) => {
    // Create a wrapper function that matches your updateElement signature
    const setElementsWrapper = (newElements: Element[]) => {
      setElementsFunc(newElements);
    };

    updateElement(id, updates, setElementsWrapper, elementsArray);
  };

  if (!selectedElement) return null;

  return (
    <section className="styleOptions">
      <div className="group strokeColor">
        <p>Stroke</p>
        <div className="innerGroup">
          {STROKE_COLORS.map((color: string, index: number) => (
            <button
              type="button"
              title={color}
              style={{ "--color": color } as React.CSSProperties}
              key={index}
              className={
                "itemButton color" +
                (color === elementStyle.strokeColor ? " selected" : "")
              }
              onClick={() => {
                setStylesStates({ strokeColor: color });
                updateElementHelper(
                  selectedElement.id,
                  { strokeColor: color },
                  setElements,
                  elements
                );
              }}
            ></button>
          ))}
        </div>
      </div>

      <div className="group backgroundColor">
        <p>Background</p>
        <div className="innerGroup">
          {BACKGROUND_COLORS.map((fill: string, index: number) => (
            <button
              type="button"
              title={fill}
              className={
                "itemButton color" +
                (fill === elementStyle.fill ? " selected" : "")
              }
              style={{ "--color": fill } as React.CSSProperties}
              key={index}
              onClick={() => {
                setStylesStates({ fill });
                updateElementHelper(
                  selectedElement.id,
                  { fill },
                  setElements,
                  elements
                );
              }}
            ></button>
          ))}
        </div>
      </div>

      <div className="group strokeWidth">
        <p>Stroke width</p>
        <div className="innerGroup">
          <input
            type="range"
            className="itemRange"
            min={0}
            max={20}
            value={elementStyle.strokeWidth}
            step="1"
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
              const newWidth = minmax(+target.value, [0, 20]);
              setStylesStates({ strokeWidth: newWidth });
              updateElementHelper(
                selectedElement.id,
                { strokeWidth: newWidth },
                setElements,
                elements
              );
            }}
          />
        </div>
      </div>

      <div className="group strokeStyle">
        <p>Stroke style</p>
        <div className="innerGroup">
          {STROKE_STYLES.map((style: StrokeStyle, index: number) => (
            <button
              type="button"
              title={style.slug}
              className={
                "itemButton option" +
                (style.slug === elementStyle.strokeStyle ? " selected" : "")
              }
              key={index}
              onClick={() => {
                setStylesStates({ strokeStyle: style.slug });
                updateElementHelper(
                  selectedElement.id,
                  { strokeStyle: style.slug },
                  setElements,
                  elements
                );
              }}
            >
              <style.icon />
            </button>
          ))}
        </div>
      </div>

      <div className="group opacity">
        <p>Opacity</p>
        <div className="innerGroup">
          <input
            type="range"
            min={0}
            max={100}
            className="itemRange"
            value={elementStyle.opacity}
            step="10"
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
              const newOpacity = minmax(+target.value, [0, 100]);
              setStylesStates({ opacity: newOpacity });
              updateElementHelper(
                selectedElement.id,
                { opacity: newOpacity },
                setElements,
                elements
              );
            }}
          />
        </div>
      </div>

      {selectedElement?.id && (
        <React.Fragment>
          <div className="group layers">
            <p>Layers</p>
            <div className="innerGroup">
              <button
                type="button"
                className="itemButton option"
                title="Send to back"
                onClick={() =>
                  moveElementLayer(selectedElement.id, 0, setElements, elements)
                }
              >
                <ToBack />
              </button>
              <button
                type="button"
                className="itemButton option"
                title="Send backward"
                onClick={() =>
                  moveElementLayer(
                    selectedElement.id,
                    -1,
                    setElements,
                    elements
                  )
                }
              >
                <Backward />
              </button>
              <button
                type="button"
                className="itemButton option"
                title="Bring forward"
                onClick={() =>
                  moveElementLayer(selectedElement.id, 1, setElements, elements)
                }
              >
                <Forward />
              </button>
              <button
                type="button"
                className="itemButton option"
                title="Bring to front"
                onClick={() =>
                  moveElementLayer(selectedElement.id, 2, setElements, elements)
                }
              >
                <ToFront />
              </button>
            </div>
          </div>

          <div className="group actions">
            <p>Actions</p>
            <div className="innerGroup">
              <button
                type="button"
                onClick={() =>
                  deleteElement(
                    selectedElement,
                    setElements,
                    setSelectedElement
                  )
                }
                title="Delete"
                className="itemButton option"
              >
                <Delete />
              </button>
              <button
                type="button"
                className="itemButton option"
                title="Duplicate ~ Ctrl + d"
                onClick={() =>
                  duplicateElement(
                    selectedElement,
                    setElements,
                    setSelectedElement,
                    10
                  )
                }
              >
                <Duplicate />
              </button>
            </div>
          </div>
        </React.Fragment>
      )}
    </section>
  );
}
