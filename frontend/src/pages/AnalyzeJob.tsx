import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { ResumeUpload } from "@/components/ResumeUpload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -z-10 -translate-y-1/2"></div>
        {[
          { num: 1, label: "Resume" },
          { num: 2, label: "Job Info" },
          { num: 3, label: "Review" }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-background px-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors ${
              step === s.num ? "border-primary bg-primary text-primary-foreground" :
              step > s.num ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground bg-card"
            }`}>
              {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader>
                <CardTitle>1. Select Resume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ResumeUpload onSelectResume={handleResumeSelect} />
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button 
                    disabled={!selectedResumeId} 
                    onClick={() => setStep(2)}
                  >
                    Continue to Job Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader>
                <CardTitle>2. Job Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJobSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name <span className="text-danger">*</span></Label>
                      <Input id="company" value={jobForm.company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobForm({...jobForm, company: e.target.value})} placeholder="e.g. Acme Corp" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job_title">Job Title <span className="text-danger">*</span></Label>
                      <Input id="job_title" value={jobForm.job_title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobForm({...jobForm, job_title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={jobForm.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Remote, San Francisco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job_url">Job URL</Label>
                      <Input id="job_url" type="url" value={jobForm.job_url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobForm({...jobForm, job_url: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_description">Job Description <span className="text-danger">*</span></Label>
                    <Textarea 
                      id="job_description" 
                      value={jobForm.job_description} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobForm({...jobForm, job_description: e.target.value})} 
                      placeholder="Paste the complete job description here including responsibilities and requirements..." 
                      className="min-h-[250px]"
                      required 
                      minLength={20}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Must be at least 20 characters</span>
                      <span>{jobForm.job_description.length} characters</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-border">
                    <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" disabled={!validateJobForm()}>
                      Review Application <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader>
                <CardTitle>3. Review & Create</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Job Details</h3>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Role</p>
                        <p className="font-medium text-foreground">{jobForm.job_title} at {jobForm.company}</p>
                      </div>
                      {(jobForm.location || jobForm.job_url) && (
                        <div className="flex gap-4">
                          {jobForm.location && <div><p className="text-xs text-muted-foreground">Location</p><p className="text-sm">{jobForm.location}</p></div>}
                          {jobForm.job_url && <div><p className="text-xs text-muted-foreground">URL</p><a href={jobForm.job_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline line-clamp-1">Link</a></div>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Resume Details</h3>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Selected File</p>
                        <p className="font-medium text-foreground">{resumeDetails?.filename || "Unknown"}</p>
                      </div>
                      <div className="flex gap-4">
                         <div><p className="text-xs text-muted-foreground">Pages</p><p className="text-sm">{resumeDetails?.page_count}</p></div>
                         <div><p className="text-xs text-muted-foreground">Characters</p><p className="text-sm">{resumeDetails?.text_length}</p></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Job Description Preview</h3>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border max-h-40 overflow-y-auto">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                      {jobForm.job_description.substring(0, 500)}
                      {jobForm.job_description.length > 500 && "..."}
                    </pre>
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 bg-danger/10 text-danger-foreground text-sm rounded-md border border-danger/20 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {submitError}
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)} disabled={isSubmitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Edit Details
                  </Button>
                  <Button onClick={handleCreateApplication} disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Application"}
                  </Button>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-success/30 bg-success/5">
              <CardContent className="p-10 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Application Ready</h2>
                  <p className="text-muted-foreground">
                    You have successfully paired your resume with the <span className="font-medium text-foreground">{jobForm.job_title}</span> role at <span className="font-medium text-foreground">{jobForm.company}</span>.
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-4">
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                  </Button>
                  <Button onClick={() => navigate(`/applications/${createdApplicationId}`)}>
                    Analyze Application <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
