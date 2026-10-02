import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { applicationService, type ApplicationListItem } from "@/services/applicationService"

function getInitials(company: string) {
  if (!company) return "NA"
  const words = company.split(" ")
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return company.substring(0, 2).toUpperCase()
}

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
    <>
      {/* BEGIN: Editorial Hero Section (Asymmetric & Dramatic) */}
      <section className="relative rounded-2xl glass-panel p-8 lg:p-10 overflow-hidden shadow-glass-subtle" data-purpose="hero-section">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-electric-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 bottom-0 w-80 h-80 bg-electric-violet/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-electric-cyan">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan shadow-[0_0_6px_#22D3EE]"></span>
              <span>Your AI Career Copilot</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.08]">
              Your next opportunity <br/>
              starts with <span className="bg-gradient-to-r from-white via-white to-electric-cyan/90 bg-clip-text text-transparent drop-shadow-sm">an edge.</span>
            </h1>
            <p className="text-canvas-muted text-base lg:text-lg font-normal leading-relaxed max-w-lg">
              Understand your fit. Close your skill gaps. Apply with confidence.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button onClick={() => navigate("/analyze")} className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-electric-violet via-electric-indigo to-electric-cyan text-white text-sm font-semibold tracking-wide shadow-glow-violet hover:shadow-glow-cyan hover:scale-[1.01] transition-all duration-300 flex items-center gap-2">
                <span>Analyze a Job</span>
                <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </button>
              <button onClick={() => navigate("/applications")} className="px-5 py-3 rounded-xl glass-panel-subtle hover:bg-surface-subtle text-canvas-text hover:text-white text-sm font-medium border border-white/10 hover:border-white/20 transition-all duration-200">
                Explore my applications
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-electric-cyan/20 animate-pulse scale-95 pointer-events-none"></div>
              <div className="absolute -inset-4 rounded-full border border-electric-violet/15 pointer-events-none"></div>
              <img alt="Iridescent glass orb" className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] animate-orb-float z-10 pointer-events-none select-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRTx77ibgyjEnMyxbFe2SKXH8T3S20_kQSjc9TUUH_1wgAlKuphWAvmK_8mu0nDIaLHfl3H9PM7f10H_zNKxHdIxNNqDbz2BKcqo7mhmfAUscQJGS50u-nm0ennUal6ody36V9ospGdR_0Cghr9OuNhaTAZ0t3vumarfXQwtE8Ng1Hpqfxg71e5MoY4ZUx-nTlTL-BfblMxSSgmlL10_TP7j6mfTylVVkcq8vjv7hfJLaDP4MZVkY" />
              <div className="absolute -bottom-2 -left-2 z-20 px-3 py-1.5 rounded-lg glass-panel text-[11px] font-mono text-electric-cyan/90 border border-electric-cyan/30 flex items-center gap-2 shadow-lg backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan"></span>
                Quantum Match: Activated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEGIN: Career Snapshot Metrics Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4" data-purpose="metrics-bar">
        <div className="glass-panel rounded-xl p-5 border border-surface-border hover:border-white/15 transition-all">
          <span className="text-[11px] font-mono uppercase tracking-wider text-canvas-muted">Resumes Uploaded</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-white">3</span>
            <span className="text-xs text-canvas-dim font-normal">Active drafts</span>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-surface-border hover:border-white/15 transition-all">
          <span className="text-[11px] font-mono uppercase tracking-wider text-canvas-muted">Jobs Analyzed</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-white">{isLoading ? "-" : applications.length}</span>
            <span className="text-xs text-electric-cyan/80 font-mono">+4 this week</span>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-surface-border hover:border-white/15 transition-all">
          <span className="text-[11px] font-mono uppercase tracking-wider text-canvas-muted">Applications Tracked</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-white">12</span>
            <span className="text-xs text-canvas-dim font-normal">Across 8 teams</span>
          </div>
        </div>
        <div className="relative glass-panel rounded-xl p-5 border border-electric-cyan/30 bg-gradient-to-br from-surface to-surface-subtle overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-electric-cyan/10 rounded-full blur-xl pointer-events-none group-hover:bg-electric-cyan/20 transition-all"></div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-electric-cyan flex items-center justify-between">
            <span>Avg Match Score</span>
            <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan shadow-[0_0_6px_#22D3EE]"></span>
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-white">78%</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">+6.4% gain</span>
          </div>
        </div>
      </section>

      {/* BEGIN: Main Workspace Asymmetric Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-purpose="workspace-columns">
        {/* LEFT COLUMN: In motion */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-surface-border space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">In motion</h2>
              <p className="text-xs text-canvas-muted">Your active target applications & status</p>
            </div>
            <button onClick={() => navigate("/applications")} className="text-xs font-mono text-electric-cyan hover:underline flex items-center gap-1">
              <span>View all applications</span>
              <span>→</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-canvas-muted py-4">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-sm text-canvas-muted py-4">No applications found. <button onClick={() => navigate("/analyze")} className="text-electric-cyan hover:underline">Analyze a job</button> to get started.</div>
            ) : (
              applications.slice(0, 3).map((app, index) => {
                // Generate a visual tint depending on index
                const borderColorClasses = [
                  "group-hover:border-electric-cyan/40",
                  "group-hover:border-electric-violet/40",
                  "group-hover:border-white/20"
                ];
                const borderHover = borderColorClasses[index % 3];
                const matchScore = 80 + (app.id.charCodeAt(0) % 15); // Stub score

                return (
                  <div key={app.id} onClick={() => navigate(`/applications/${app.id}`)} className="cursor-pointer group p-4 rounded-xl glass-panel-subtle hover:bg-surface-subtle/90 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center font-mono text-sm font-semibold text-white shadow-inner ${borderHover} transition-colors`}>
                        {getInitials(app.company)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-electric-cyan transition-colors line-clamp-1">{app.company}</h3>
                        <div className="text-xs text-canvas-muted flex items-center gap-2 mt-0.5">
                          <span className="line-clamp-1">{app.job_title}</span>
                          <span className="text-canvas-dim">•</span>
                          <span className="text-electric-cyan font-mono font-medium">{matchScore}% Match</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Analyzed
                      </span>
                      <span className="text-canvas-dim group-hover:text-white transition-colors">›</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Career Intelligence Instrument */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-surface-border flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-white">Career intelligence</h2>
              <span className="text-[11px] font-mono text-canvas-dim">Instrument 01</span>
            </div>
            
            <div className="relative py-2 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" fill="none" r="68" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="6"></circle>
                  <circle cx="80" cy="80" fill="none" r="54" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 5" strokeWidth="1.5"></circle>
                  <defs>
                    <linearGradient id="ringGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#22D3EE"></stop>
                      <stop offset="100%" stopColor="#8B5CF6"></stop>
                    </linearGradient>
                  </defs>
                  <circle cx="80" cy="80" fill="none" r="68" stroke="url(#ringGradient)" strokeDasharray="427" strokeDashoffset="94" strokeLinecap="round" strokeWidth="6"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold tracking-tight text-white">78%</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-canvas-muted mt-0.5">Average Fit</span>
                </div>
              </div>
              <div className="w-full pt-3 px-2 flex items-center justify-between text-xs font-mono text-canvas-dim border-t border-white/5 mt-2">
                <span>Recent Submissions</span>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span>Upward trend</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3.5 rounded-xl bg-electric-glow/20 border border-electric-violet/30 flex items-start gap-3">
            <svg className="w-4 h-4 text-electric-cyan shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <p className="text-xs text-canvas-text leading-relaxed">
              Your strongest matches are in <strong className="text-white font-medium">AI engineering</strong> and prompt architecture roles.
            </p>
          </div>
        </div>
      </section>

      {/* BEGIN: Recommended Next Step Banner */}
      <section className="relative rounded-2xl glass-panel p-6 border border-white/10 overflow-hidden group">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-gradient-to-tl from-electric-violet/20 via-electric-cyan/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest uppercase text-electric-cyan font-semibold">A Little Closer</span>
            <h3 className="text-lg font-bold text-white tracking-tight">Strengthen your LLM experience.</h3>
            <p className="text-sm text-canvas-muted max-w-2xl">
              Make your relevant projects and retrieval experience easier for recruiters to identify by aligning benchmark terminology in Resume #2.
            </p>
          </div>
          <button className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel-subtle hover:bg-white/10 text-white text-xs font-semibold border border-white/15 hover:border-white/30 transition-all shadow-sm">
            <span>View recommendations</span>
            <span className="text-electric-cyan">→</span>
          </button>
        </div>
      </section>
    </>
  )
}
