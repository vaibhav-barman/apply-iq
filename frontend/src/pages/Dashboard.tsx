import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Briefcase, TrendingUp, AlertCircle, Plus, ChevronRight, Loader2 } from "lucide-react"
import { applicationService, type ApplicationListItem } from "@/services/applicationService"

export default function Dashboard() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<ApplicationListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const apps = await applicationService.getApplications()
        setApplications(apps)
      } catch (err) {
        console.error("Failed to load applications", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back. Here's an overview of your job search progress.</p>
        </div>
        <button onClick={() => navigate("/analyze")} className="flex items-center bg-primary hover:shadow-btn-primary-hover shadow-btn-primary transition-all duration-300 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
          <Plus className="mr-2 h-4 w-4" /> New Analysis
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Stat Cards */}
        {[
          { title: "Analyzed Jobs", icon: Briefcase, iconColor: "text-primary", value: isLoading ? "-" : applications.length, desc: "Applications tracked via AI" },
          { title: "Average Match", icon: TrendingUp, iconColor: "text-success", value: "--%", desc: "Coming in Phase 5" },
          { title: "Critical Warnings", icon: AlertCircle, iconColor: "text-warning", value: "-", desc: "Coming in Phase 5" }
        ].map((stat, i) => (
          <div key={i} className="bg-glass-raised backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass-floor transition-transform hover:-translate-y-1 hover:border-border-active">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Recent Applications Activity */}
        <div className="bg-glass-raised backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass-floor flex flex-col">
          <div className="flex flex-row items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Applications</h3>
              <p className="text-sm text-muted-foreground">Your latest job pairings</p>
            </div>
            <button onClick={() => navigate("/applications")} className="text-sm text-primary hover:text-primary/80 font-medium">
              View all
            </button>
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-primary min-h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-3">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex items-center gap-4 p-4 rounded-xl bg-glass-base border border-white/5 hover:border-border-active hover:shadow-glow transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/applications/${app.id}`)}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{app.job_title}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{app.company}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-xl min-h-[200px] bg-glass-base">
                <FileText className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
                <p className="text-sm font-medium text-foreground">No applications yet</p>
                <p className="text-xs text-muted-foreground mt-1 mb-6 max-w-[200px]">Start by analyzing a new job description.</p>
                <button onClick={() => navigate("/analyze")} className="bg-white/5 border border-white/10 hover:bg-white/10 text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Analyze Job
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Phase 5 Teaser (Actionable Insights) */}
        <div className="relative overflow-hidden bg-glass-raised backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-glass-floor flex flex-col group">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 pointer-events-none" />
           <div className="absolute top-4 right-4 z-10">
              <span className="bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full border border-primary/30 shadow-glow">Phase 5 Preview</span>
           </div>
          <div className="mb-6 relative z-10">
            <h3 className="text-lg font-semibold text-foreground">Actionable Insights</h3>
            <p className="text-sm text-muted-foreground">AI-driven recommendations</p>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center py-6 relative z-10">
             <div className="w-16 h-16 rounded-2xl bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow duration-500">
                <TrendingUp className="h-8 w-8 text-tertiary" />
             </div>
             <h3 className="text-base font-semibold text-foreground mb-2">Unlock Deep Analysis</h3>
             <p className="text-sm text-muted-foreground mb-8 max-w-[260px] mx-auto leading-relaxed">
                Get ATS compatibility scores, identify missing keywords, and receive tailored interview preparation directly from Gemini AI.
             </p>
             <button className="bg-white/5 border border-primary/30 text-muted-foreground px-6 py-2 rounded-md text-sm font-medium pointer-events-none opacity-50">
                Coming Soon
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}
