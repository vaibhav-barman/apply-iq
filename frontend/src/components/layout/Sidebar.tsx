import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FileSearch, 
  CheckCircle, 
  Search, 
  PenTool, 
  ListOrdered, 
  Users, 
  MessageSquare, 
  Mail, 
  FileText, 
  History, 
  Settings 
} from "lucide-react"

export function Sidebar() {
  const location = useLocation()

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
      ],
    },
    {
      title: "APPLICATION",
      items: [
        { name: "Analyze Job", path: "/analyze", icon: FileSearch },
        { name: "Job Match", path: "/job-match", icon: CheckCircle },
        { name: "ATS Keywords", path: "/ats-keywords", icon: Search },
      ],
    },
    {
      title: "OPTIMIZE",
      items: [
        { name: "Resume Rewriter", path: "/optimize/rewrite", icon: PenTool },
        { name: "Bullet Enhancer", path: "/optimize/bullets", icon: ListOrdered },
      ],
    },
    {
      title: "PREPARE",
      items: [
        { name: "Interview Prep", path: "/prepare/interview", icon: Users },
        { name: "Hiring Manager Test", path: "/prepare/hiring-manager", icon: MessageSquare },
      ],
    },
    {
      title: "OUTREACH",
      items: [
        { name: "Recruiter Message", path: "/outreach/recruiter", icon: Mail },
        { name: "Cover Letter", path: "/outreach/cover-letter", icon: FileText },
      ],
    },
    {
      title: "HISTORY",
      items: [
        { name: "Applications", path: "/applications", icon: History },
      ],
    },
  ]

  return (
    <aside className="w-64 border-r border-white/5 bg-glass-base backdrop-blur-md flex flex-col h-full shrink-0 hidden md:flex relative z-10 shadow-glass-floor">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight text-primary">APPLYIQ</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h2 className="px-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-3">
              {group.title}
            </h2>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-glow"
                        : "text-muted-foreground hover:bg-glass-hover hover:text-foreground border border-transparent"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/5">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-glass-hover hover:text-foreground transition-all duration-200 border border-transparent"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
