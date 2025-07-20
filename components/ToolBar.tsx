import { useAppContext } from "../provider/AppStates";
import React from "react";

interface ToolItem {
  slug: string;
  icon: React.FC;
  title: string;
  toolAction: (slug: string) => void;
}

export function ToolBar() {
  const { tools: toolCols, selectedTool, lockTool } = useAppContext();
  return (
    <section className="toolbar">
      {toolCols.map((tools: ToolItem[], index: number) => (
        <div key={index}>
          {tools.map((tool: ToolItem, index_: number) => (
            <button
              key={index_}
              className={[
                "toolbutton",
                tool.slug,
                selectedTool === tool.slug ? "selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-locked={lockTool}
              onClick={() => tool.toolAction(tool.slug)}
              title={tool.title}
            >
              <tool.icon />
            </button>
          ))}
        </div>
      ))}
    </section>
  );
}
