import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Plus, ChevronRight, Briefcase, Search, Loader2 } from "lucide-react"
import { applicationService, type ApplicationListItem } from "@/services/applicationService"

export default function ApplicationHistory() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<ApplicationListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await applicationService.getApplications()
      setApplications(data)
    } catch (err) {
      console.error("Failed to load applications", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchApplications();
  }, []);

  const filteredApps = applications.filter(app => 
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'draft':
      case 'ready':
        return <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-white/5 text-muted-foreground border border-white/10">Draft</span>
      case 'analyzed':
        return <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-primary/20 text-primary border border-primary/30 shadow-glow">Analyzed</span>
      default:
        return <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-white/5 text-muted-foreground border border-white/10">{status}</span>
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-1">Manage and track your job application analyses.</p>
        </div>
        <button 
          onClick={() => navigate("/analyze")}
          className="flex items-center bg-primary hover:shadow-btn-primary-hover shadow-btn-primary transition-all duration-300 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus className="mr-2 h-4 w-4" /> Analyze New Job
        </button>
      </div>

      <div className="bg-glass-raised backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass-floor overflow-hidden flex flex-col">
        <div className="p-5 border-b border-white/10 flex items-center gap-4 bg-white/5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search companies or roles..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-input-focus transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
             <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
             <p className="text-sm font-medium">Loading your applications...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="divide-y divide-white/5 flex-1 overflow-y-auto">
            {filteredApps.map((app) => (
              <div 
                key={app.id} 
                className="p-5 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group cursor-pointer"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <div className="flex items-start gap-5 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{app.job_title}</h3>
                    <p className="text-sm text-muted-foreground">{app.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/80">
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" /> {app.resume_filename}
                      </span>
                      <span className="text-white/20">•</span>
                      <span>{new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 justify-between sm:justify-end mt-4 sm:mt-0">
                  {getStatusBadge(app.status)}
                  <button className="text-muted-foreground group-hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/10">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground flex items-center justify-center mb-6 shadow-inner">
              <Briefcase className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No applications found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
              {searchQuery ? "We couldn't find any applications matching your search." : "You haven't analyzed any job applications yet."}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => navigate("/analyze")}
                className="flex items-center bg-primary hover:shadow-btn-primary-hover shadow-btn-primary transition-all duration-300 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium"
              >
                <Plus className="mr-2 h-4 w-4" /> Start Your First Analysis
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
