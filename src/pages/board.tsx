import { UI_LABELS } from "@/constants/ui.constants";

export function BoardPage(): React.JSX.Element {
  return (
    <div className="p-8 max-w-4xl mx-auto text-foreground">
      <h1 className="text-3xl font-bold mb-4">{UI_LABELS.BOARD.TITLE}</h1>
      <p className="text-muted-foreground mb-8">{UI_LABELS.BOARD.SUBTITLE}</p>
      
      <div className="h-64 bg-card border border-border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
        {UI_LABELS.BOARD.PLACEHOLDER}
      </div>
    </div>
  );
}
