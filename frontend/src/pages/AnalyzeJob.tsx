import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { ResumeUpload } from "@/components/ResumeUpload"
import { applicationService, type ApplicationCreate } from "@/services/applicationService"
import { resumeService, type ResumeResponse } from "@/services/resumeService"

type Step = 1 | 2 | 3 | 4

export default function AnalyzeJob() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  
  // Form State
  const [selectedResumeId, setSelectedResumeId] = useState<string>("")
  const [resumeDetails, setResumeDetails] = useState<ResumeResponse | null>(null)
  
  const [jobForm, setJobForm] = useState({
    company: "",
    job_title: "",
    location: "",
    job_url: "",
    job_description: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdApplicationId, setCreatedApplicationId] = useState<string | null>(null)

  const handleResumeSelect = async (resumeId: string) => {
    setSelectedResumeId(resumeId)
    if (resumeId) {
      try {
        const detail = await resumeService.getResume(resumeId)
        setResumeDetails(detail)
      } catch (err) {
        console.error(err)
      }
    } else {
      setResumeDetails(null)
    }
  }

  const validateJobForm = () => {
    if (!jobForm.company.trim() || !jobForm.job_title.trim() || !jobForm.job_description.trim()) return false
    if (jobForm.job_description.length < 20) return false
    if (jobForm.job_url && !jobForm.job_url.startsWith("http")) return false
    return true
  }

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateJobForm()) setStep(3)
  }

  const handleCreateApplication = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const payload: ApplicationCreate = {
        resume_id: selectedResumeId,
        company: jobForm.company,
        job_title: jobForm.job_title,
        job_description: jobForm.job_description,
        job_url: jobForm.job_url || undefined,
        location: jobForm.location || undefined,
        status: "ready"
      }
      
      const app = await applicationService.createApplication(payload)
      setCreatedApplicationId(app.id)
      setStep(4)
    } catch (err: any) {
      console.error(err)
      setSubmitError(err.response?.data?.detail || "Failed to create application.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analyze Application</h1>
        <p className="text-muted-foreground mt-1">Pair your resume with a job description for AI analysis.</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between relative max-w-2xl mx-auto mb-12">
        <div className="absolute left-0 top-1/2 w-full h-[1px] bg-white/10 -z-10 -translate-y-1/2"></div>
        {[
          { num: 1, label: "Resume" },
          { num: 2, label: "Job Info" },
          { num: 3, label: "Review" }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-3 bg-background px-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
              step === s.num ? "border-primary bg-primary text-primary-foreground shadow-glow" :
              step > s.num ? "border border-primary text-primary bg-primary/10" : "border border-white/10 text-muted-foreground bg-glass-base"
            }`}>
              {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
            </div>
            <span className={`text-xs font-medium tracking-wide uppercase ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-glass-raised backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-glass-floor">
              <h2 className="text-xl font-semibold mb-6">1. Select Resume</h2>
              <div className="space-y-8">
                <ResumeUpload onSelectResume={handleResumeSelect} />
                <div className="flex justify-end pt-6 border-t border-white/10">
                  <button 
                    disabled={!selectedResumeId} 
                    onClick={() => setStep(2)}
                    className="flex items-center bg-primary hover:shadow-btn-primary-hover shadow-btn-primary transition-all duration-300 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    Continue to Job Details <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-glass-raised backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-glass-floor">
              <h2 className="text-xl font-semibold mb-6">2. Job Information</h2>
              <form onSubmit={handleJobSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">Company Name <span className="text-danger">*</span></label>
                    <input id="company" className="w-full bg-glass-base border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-input-focus transition-all" value={jobForm.company} onChange={(e) => setJobForm({...jobForm, company: e.target.value})} placeholder="e.g. Acme Corp" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="job_title" className="text-sm font-medium">Job Title <span className="text-danger">*</span></label>
                    <input id="job_title" className="w-full bg-glass-base border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-input-focus transition-all" value={jobForm.job_title} onChange={(e) => setJobForm({...jobForm, job_title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">Location</label>
                    <input id="location" className="w-full bg-glass-base border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-input-focus transition-all" value={jobForm.location} onChange={(e) => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Remote, San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="job_url" className="text-sm font-medium">Job URL</label>
                    <input id="job_url" type="url" className="w-full bg-glass-base border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-input-focus transition-all" value={jobForm.job_url} onChange={(e) => setJobForm({...jobForm, job_url: e.target.value})} placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="job_description" className="text-sm font-medium">Job Description <span className="text-danger">*</span></label>
                  <textarea 
                    id="job_description" 
                    value={jobForm.job_description} 
                    onChange={(e) => setJobForm({...jobForm, job_description: e.target.value})} 
                    placeholder="Paste the complete job description here including responsibilities and requirements..." 
                    className="w-full min-h-[250px] bg-glass-base border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-input-focus transition-all resize-y"
                    required 
                    minLength={20}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Must be at least 20 characters</span>
                    <span>{jobForm.job_description.length} characters</span>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-white/10">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </button>
                  <button type="submit" disabled={!validateJobForm()} className="flex items-center bg-primary hover:shadow-btn-primary-hover shadow-btn-primary transition-all duration-300 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    Review Application <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-glass-raised backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-glass-floor space-y-8">
              <h2 className="text-xl font-semibold">3. Review & Create</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase text-primary tracking-widest">Job Details</h3>
                  <div className="bg-glass-base p-5 rounded-xl border border-white/5 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Role</p>
                      <p className="font-medium text-foreground">{jobForm.job_title} at {jobForm.company}</p>
                    </div>
                    {(jobForm.location || jobForm.job_url) && (
                      <div className="flex gap-6">
                        {jobForm.location && <div><p className="text-xs text-muted-foreground mb-1">Location</p><p className="text-sm">{jobForm.location}</p></div>}
                        {jobForm.job_url && <div><p className="text-xs text-muted-foreground mb-1">URL</p><a href={jobForm.job_url} target="_blank" rel="noreferrer" className="text-sm text-tertiary hover:underline line-clamp-1">Link</a></div>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase text-primary tracking-widest">Resume Details</h3>
                  <div className="bg-glass-base p-5 rounded-xl border border-white/5 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Selected File</p>
                      <p className="font-medium text-foreground">{resumeDetails?.filename || "Unknown"}</p>
                    </div>
                    <div className="flex gap-6">
                       <div><p className="text-xs text-muted-foreground mb-1">Pages</p><p className="text-sm">{resumeDetails?.page_count}</p></div>
                       <div><p className="text-xs text-muted-foreground mb-1">Characters</p><p className="text-sm">{resumeDetails?.text_length}</p></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-primary tracking-widest">Job Description Preview</h3>
                <div className="bg-glass-base p-5 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                    {jobForm.job_description.substring(0, 500)}
                    {jobForm.job_description.length > 500 && "..."}
                  </pre>
                </div>
              </div>

              {submitError && (
                <div className="p-4 bg-danger/10 text-danger-foreground text-sm rounded-xl border border-danger/20 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" /> {submitError}
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-white/10">
                <button type="button" onClick={() => setStep(2)} disabled={isSubmitting} className="flex items-center text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium disabled:opacity-50">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Edit Details
                </button>
                <button onClick={handleCreateApplication} disabled={isSubmitting} className="flex items-center bg-primary hover:shadow-btn-primary-hover shadow-btn-primary transition-all duration-300 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Application"}
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="border border-success/30 bg-glass-raised backdrop-blur-xl shadow-glow rounded-2xl">
              <div className="p-12 text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-success/10 text-success rounded-full border border-success/20 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">Application Ready</h2>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    You have successfully paired your resume with the <span className="font-medium text-foreground">{jobForm.job_title}</span> role at <span className="font-medium text-foreground">{jobForm.company}</span>.
                  </p>
                </div>
                <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => navigate("/dashboard")} className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                    Back to Dashboard
                  </button>
                  <button onClick={() => navigate(`/applications/${createdApplicationId}`)} className="flex items-center justify-center px-6 py-3 bg-primary hover:shadow-btn-primary-hover shadow-btn-primary transition-all duration-300 text-primary-foreground rounded-lg text-sm font-medium">
                    Analyze Application <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
