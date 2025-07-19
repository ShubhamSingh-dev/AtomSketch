import { useAppContext } from "../provider/AppStates";

export function ToolBar() {
  const { tools: toolCols, selectedTool, lockTool } = useAppContext();
  return (
    <section className="toolbar">
      {toolCols.map((tools: any, index: any) => {
        <div key={index}>
          {tools.map((tool: any, index_: any) => {
            <button
              key={index_}
              className={
                "toolButton" +
                `${tool.slug}` +
                (selectedTool === tool.slug ? " selected" : "")
              }
              data-locked={lockTool}
              onClick={() => tool.toolAction(tool.slug)}
              title={tool.title}
            >
              <tool.icon />
            </button>;
          })}
        </div>;
      })}
    </section>
  );
}
