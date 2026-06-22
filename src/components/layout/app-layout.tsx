import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useSidebarOpen } from "@/store/ui.store";
import type { ChildrenProps } from "@/types";

export function AppLayout({ children }: ChildrenProps): React.JSX.Element {
  const isSidebarOpen = useSidebarOpen();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Content wrapper with transition alignment */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${
        isSidebarOpen ? "pl-64" : "pl-16"
      }`}>
        <Header />
        <main className="flex-1 bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}
