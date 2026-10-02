import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Plus, ChevronRight, Briefcase, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { applicationService, type ApplicationListItem } from "@/services/applicationService"

export default function ApplicationHistory() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<ApplicationListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const data = await applicationService.getApplications()
      setApplications(data)
    } catch (err) {
      console.error("Failed to load applications", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredApps = applications.filter(app => 
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'draft':
      case 'ready':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">Draft</span>
      case 'analyzed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">Analyzed</span>
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">{status}</span>
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-1">Manage and track your job application analyses.</p>
        </div>
        <Button onClick={() => navigate("/analyze")}>
          <Plus className="mr-2 h-4 w-4" /> Analyze New Job
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies or roles..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
             <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
             <p>Loading your applications...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredApps.map((app) => (
              <div 
                key={app.id} 
                className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group cursor-pointer"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{app.job_title}</h3>
                    <p className="text-sm text-muted-foreground">{app.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {app.resume_filename}
                      </span>
                      <span>•</span>
                      <span>{new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  {getStatusBadge(app.status)}
                  <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center border-t border-border border-dashed m-4 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No applications found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {searchQuery ? "We couldn't find any applications matching your search." : "You haven't analyzed any job applications yet."}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/analyze")}>
                <Plus className="mr-2 h-4 w-4" /> Start Your First Analysis
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
