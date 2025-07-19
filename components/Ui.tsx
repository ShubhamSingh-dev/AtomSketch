import { Collaboration } from "./Collaboration";
import { Credits } from "./Credits";
import { Menu } from "./Menu";
import { Style } from "./Style";
import { ToolBar } from "./ToolBar";
import { UndoRedo } from "./UndoRedo";
import { Zoom } from "./Zoom";
import { useAppContext } from "../provider/AppStates"; // Import useAppContext

export function Ui() {
  // Destructure selectedTool, selectedElement, and style from useAppContext
  const { selectedTool, selectedElement, style } = useAppContext();

  return (
    <main className="ui">
      <header>
        <Menu />
        <ToolBar />
        <Collaboration />
      </header>
      {(!["selection", "hand"].includes(selectedTool) || selectedElement) && (
        <Style selectedElement={selectedElement || style} />
      )}
      <footer>
        <div>
          <Zoom />
          <UndoRedo />
        </div>
        <div>
          <Credits />
        </div>
      </footer>
    </main>
  );
}
