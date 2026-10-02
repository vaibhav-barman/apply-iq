import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, CheckCircle, AlertCircle, File as FileIcon, Trash2, Loader2, List as ListIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { resumeService, type ResumeResponse, type ResumeListItem } from "@/services/resumeService"

interface ResumeUploadProps {
  onSelectResume?: (resumeId: string) => void
}

export function ResumeUpload({ onSelectResume }: ResumeUploadProps) {
  const [resumes, setResumes] = useState<ResumeListItem[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [selectedResumeDetail, setSelectedResumeDetail] = useState<ResumeResponse | null>(null)
  
  const [status, setStatus] = useState<"idle" | "loading_list" | "uploading" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const fetchResumes = useCallback(async () => {
    setStatus("loading_list")
    try {
      const data = await resumeService.getResumes()
      setResumes(data)
      setStatus("idle")
    } catch (err) {
      console.error(err)
      setStatus("error")
      setErrorMsg("Failed to load your resumes.")
    }
  }, [])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  const selectResume = useCallback(async (id: string) => {
    setSelectedResumeId(id)
    if (onSelectResume) onSelectResume(id)
    try {
      const detail = await resumeService.getResume(id)
      setSelectedResumeDetail(detail)
    } catch (err) {
      console.error(err)
    }
  }, [onSelectResume])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File too large. Maximum size is 5MB.")
      setStatus("error")
      return
    }

    setUploadFile(file)
    setStatus("uploading")
    setErrorMsg(null)

    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    try {
      const response = await resumeService.uploadResume(file)
      clearInterval(interval)
      setUploadProgress(100)
      
      setResumes(prev => [response.resume, ...prev])
      selectResume(response.resume.id)
      
    } catch (err: any) {
      clearInterval(interval)
      console.error(err)
      setStatus("error")
      setErrorMsg(err.response?.data?.detail || "Failed to upload and parse resume.")
    } finally {
      setTimeout(() => {
        setUploadProgress(0)
        setUploadFile(null)
        setStatus(prev => prev === "uploading" ? "idle" : prev)
      }, 500)
    }
  }, [selectResume])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    multiple: false,
  })

  const deleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("This will remove this resume and its extracted text from ApplyIQ. Are you sure?")) return
    
    setIsDeleting(id)
    try {
      await resumeService.deleteResume(id)
      setResumes(prev => prev.filter(r => r.id !== id))
      if (selectedResumeId === id) {
        setSelectedResumeId(null)
        setSelectedResumeDetail(null)
        if (onSelectResume) onSelectResume("")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to delete resume.")
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Existing Resumes List */}
      {resumes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ListIcon className="h-4 w-4" /> Your Resumes
          </h3>
          <div className="grid gap-3">
            {resumes.map(resume => {
              const isSelected = selectedResumeId === resume.id
              return (
                <Card 
                  key={resume.id}
                  onClick={() => selectResume(resume.id)}
                  className={`cursor-pointer transition-all duration-200 border ${isSelected ? 'border-primary ring-1 ring-primary/20 bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50'}`}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <FileIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {resume.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Added {new Date(resume.created_at).toLocaleDateString()} • {(resume.file_size / 1024 / 1024).toFixed(2)} MB • {resume.page_count} pages
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-danger hover:bg-danger/10"
                        onClick={(e) => deleteResume(resume.id, e)}
                        disabled={isDeleting === resume.id}
                      >
                        {isDeleting === resume.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Resume Preview */}
      {selectedResumeDetail && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <div className="flex items-center gap-2 mb-2">
               <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="w-full">
                 {showPreview ? "Hide Preview" : "Preview Extracted Text"}
               </Button>
            </div>
            {showPreview && (
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                <div className="p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {selectedResumeDetail.extracted_text}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Upload Dropzone */}
      <AnimatePresence mode="wait">
        {status === "uploading" ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <FileIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{uploadFile?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile?.size ? uploadFile.size / 1024 / 1024 : 0).toFixed(2)} MB • Uploading & Extracting...
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-8 transition-colors duration-200 ease-in-out cursor-pointer overflow-hidden
                ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}
                ${status === "error" ? "border-danger/50 bg-danger/5" : "bg-card"}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className={`p-3 rounded-full ${isDragActive ? "bg-primary/10" : "bg-muted"}`}>
                  <UploadCloud className={`h-6 w-6 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Upload a new resume
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF or DOCX up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {status === "error" && (
              <div className="mt-4 flex items-start gap-2 p-3 text-sm text-danger-foreground bg-danger/10 rounded-md">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
