import { Search, Bell } from "lucide-react"

export function Topbar() {
  return (
    <header className="h-16 border-b border-surface-border px-8 flex items-center justify-between z-10 bg-midnight/50 backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs font-mono text-canvas-muted">
        <span className="hover:text-canvas-text transition-colors cursor-pointer">Workspace</span>
        <span className="text-canvas-dim">/</span>
        <span className="text-white font-medium">Overview</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-3 px-3 py-1.5 text-xs text-canvas-muted bg-surface-subtle/80 hover:bg-surface-subtle border border-surface-border hover:border-white/20 rounded-full transition-all">
          <Search className="w-3.5 h-3.5 text-canvas-dim" />
          <span>Search or jump to...</span>
          <kbd className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-canvas-dim">⌘K</kbd>
        </button>
        
        <button aria-label="Notifications" className="relative p-2 rounded-lg text-canvas-muted hover:text-white hover:bg-surface-hover border border-transparent hover:border-surface-border transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-electric-cyan rounded-full shadow-[0_0_8px_#22D3EE]"></span>
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-surface-border">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-violet to-electric-cyan p-[1px]">
            <div className="w-full h-full rounded-full bg-midnight flex items-center justify-center text-xs font-semibold text-white">
              JD
            </div>
          </div>
          <span className="text-xs font-medium text-canvas-text hidden sm:inline-block">Julian Diaz</span>
        </div>
      </div>
    </header>
  )
}
