import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import Dashboard from "@/pages/Dashboard"
import AnalyzeJob from "@/pages/AnalyzeJob"
import ApplicationHistory from "@/pages/ApplicationHistory"
import PlaceholderPage from "@/pages/PlaceholderPage"
import AnalysisResults from "@/pages/AnalysisResults"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<AnalyzeJob />} />
          <Route path="/applications/:id/analysis" element={<AnalysisResults />} />
          <Route path="/applications" element={<ApplicationHistory />} />
          <Route path="/job-match" element={<PlaceholderPage title="Job Match" />} />
          <Route path="/ats-keywords" element={<PlaceholderPage title="ATS Keywords" />} />
          <Route path="/optimize/rewrite" element={<PlaceholderPage title="Resume Rewriter" />} />
          <Route path="/optimize/bullets" element={<PlaceholderPage title="Bullet Enhancer" />} />
          <Route path="/prepare/interview" element={<PlaceholderPage title="Interview Prep" />} />
          <Route path="/prepare/hiring-manager" element={<PlaceholderPage title="Hiring Manager Test" />} />
          <Route path="/outreach/recruiter" element={<PlaceholderPage title="Recruiter Message" />} />
          <Route path="/outreach/cover-letter" element={<PlaceholderPage title="Cover Letter" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
