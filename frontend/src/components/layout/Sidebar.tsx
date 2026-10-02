import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FileSearch, 
  PenTool, 
  Users, 
  History, 
  Settings 
} from "lucide-react"

export function Sidebar() {
  const location = useLocation()

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Overview", path: "/", icon: LayoutDashboard },
      ],
    },
    {
      title: "APPLICATION",
      items: [
        { name: "Analyze Job", path: "/analyze", icon: FileSearch },
        { name: "Applications", path: "/applications", icon: History },
      ],
    },
    {
      title: "OPTIMIZE",
      items: [
        { name: "Resume Studio", path: "/optimize/rewrite", icon: PenTool },
      ],
    },
    {
      title: "PREPARE",
      items: [
        { name: "Interview Prep", path: "/prepare/interview", icon: Users },
      ],
    },
  ]

  return (
    <aside className="w-[230px] shrink-0 min-h-screen border-r border-surface-border flex flex-col justify-between p-5 bg-midnight/90 backdrop-blur-xl z-20">
      <div className="space-y-8">
        {/* Brand Logo Mark & Name */}
        <div className="flex items-center gap-3 px-1.5 py-1">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-electric-indigo via-electric-violet to-electric-cyan p-[1px] shadow-glow-violet">
            <div className="w-full h-full bg-[#090B16] rounded-[7px] flex items-center justify-center">
              {/* Custom Geometric Minimal Spark Mark */}
              <svg className="w-4 h-4 text-electric-cyan" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-base text-white">ApplyIQ</span>
            <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded uppercase font-semibold bg-electric-violet/15 text-electric-cyan border border-electric-cyan/20">AI</span>
          </div>
        </div>

        {/* Navigation Link Items */}
        <nav className="space-y-6 text-sm font-medium">
          {navGroups.map((group) => (
            <div key={group.title}>
              {/* <h2 className="px-3 text-[10px] font-semibold text-canvas-dim tracking-widest uppercase mb-3">
                {group.title}
              </h2> */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                        isActive
                          ? "text-white bg-surface-subtle/80 border border-white/5"
                          : "text-canvas-muted hover:text-white hover:bg-surface-hover border border-transparent"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-gradient-to-b from-electric-cyan to-electric-violet"></div>
                      )}
                      <item.icon className={cn(
                        "w-4 h-4 transition-colors", 
                        isActive ? "text-electric-cyan" : "text-canvas-dim group-hover:text-electric-violet"
                      )} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
          
          <div className="pt-2">
            <Link
              to="/settings"
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                location.pathname === "/settings"
                  ? "text-white bg-surface-subtle/80 border border-white/5"
                  : "text-canvas-muted hover:text-white hover:bg-surface-hover border border-transparent"
              )}
            >
              <Settings className="w-4 h-4 text-canvas-dim group-hover:text-white transition-colors" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Engine Status Pill at Sidebar Foot */}
      <div className="pt-4 border-t border-surface-border">
        <div className="px-3 py-2 rounded-lg bg-surface/50 border border-white/5 flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-cyan"></span>
          </span>
          <div className="text-[11px] font-mono text-canvas-muted leading-tight">
            <span className="text-white font-medium">Copilot Engine</span> v2.4<br/>
            <span className="text-emerald-400/90">● Online</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
