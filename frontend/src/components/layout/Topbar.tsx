import { Menu, UserCircle } from "lucide-react"

export function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-glass-base backdrop-blur-md shadow-sm relative z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden -ml-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-glass-hover border border-transparent">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-medium text-foreground">Alex</span>
          <span className="text-xs text-muted-foreground">Free Plan</span>
        </div>
        <button className="rounded-full h-9 w-9 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-glow hover:bg-primary/30 transition-colors">
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">User profile</span>
        </button>
      </div>
    </header>
  )
}
