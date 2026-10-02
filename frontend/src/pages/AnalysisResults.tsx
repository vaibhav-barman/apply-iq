import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { analysisService, type AnalysisResultSchema } from '@/services/analysisService';
import { applicationService, type ApplicationResponse } from '@/services/applicationService';

export default function AnalysisResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisResultSchema | null>(null);
  const [application, setApplication] = useState<ApplicationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const appData = await applicationService.getApplication(id);
        setApplication(appData);
        
        try {
          const analysisData = await analysisService.getAnalysis(id);
          setAnalysis(analysisData);
        } catch (err: any) {
          // If analysis not found (404), trigger an analysis
          if (err.response && err.response.status === 404) {
            const newAnalysis = await analysisService.analyzeApplication(id);
            setAnalysis(newAnalysis);
          } else {
            throw err;
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 pb-28 min-h-[500px]">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-accentCyan animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400 font-medium">Analyzing your application with Gemini...</p>
      </div>
    );
  }

  if (error || !analysis || !application) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 pb-28 min-h-[500px]">
        <div className="text-red-400 mb-2">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white">Analysis Failed</h2>
        <p className="text-sm text-slate-400 mt-2">{error}</p>
        <button onClick={() => navigate('/applications')} className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors">
          Go back to applications
        </button>
      </div>
    );
  }

  const scoreColor = analysis.overall_score >= 80 ? 'text-accentEmerald' 
                   : analysis.overall_score >= 60 ? 'text-accentCyan' 
                   : analysis.overall_score >= 40 ? 'text-accentAmber' 
                   : 'text-red-400';

  const strokeColor = analysis.overall_score >= 80 ? 'stroke-accentEmerald' 
                   : analysis.overall_score >= 60 ? 'stroke-accentCyan' 
                   : analysis.overall_score >= 40 ? 'stroke-accentAmber' 
                   : 'stroke-red-400';
                   
  const strokeDashoffset = 314.159 - (314.159 * analysis.overall_score) / 100;

  const validSkills = analysis.skills_alignment.filter(s => s.status === 'matched');
  const partialSkills = analysis.skills_alignment.filter(s => s.status === 'partial');
  const missingSkills = analysis.skills_alignment.filter(s => s.status === 'missing');

  const keywordFound = analysis.keyword_coverage.filter(k => k.status === 'found').length;
  const keywordTotal = analysis.keyword_coverage.length;
  const keywordScore = keywordTotal > 0 ? Math.round((keywordFound / keywordTotal) * 100) : 0;
  const skillsScore = analysis.skills_alignment.length > 0 ? Math.round((validSkills.length / analysis.skills_alignment.length) * 100) : 0;
  
  // Calculate experience requirement fit (rough estimate)
  const expMatch = analysis.experience_requirements.relevant_experience.length;
  const expMissing = analysis.experience_requirements.missing_requirements.length;
  const expScore = expMatch + expMissing > 0 ? Math.round((expMatch / (expMatch + expMissing)) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-28">
      {/* TopHeaderBar */}
      <header className="h-16 border-b border-white/5 bg-midnight/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30" data-purpose="top-header">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">Workspace</Link>
          <span className="text-slate-600">/</span>
          <Link to="/applications" className="text-slate-400 hover:text-white transition-colors">Job Analyzer</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-medium flex items-center gap-1.5">
            Analysis Report
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">#{application.id.substring(0, 6).toUpperCase()}</span>
          </span>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <svg className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input className="pl-9 pr-10 py-1.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none w-56 cursor-pointer transition-all" placeholder="Search or jump to..." readOnly type="text"/>
            <kbd className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-500 bg-white/5 px-1 py-0.2 rounded border border-white/10">⌘K</kbd>
          </div>
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <svg className="w-4 h-4 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accentCyan"></span>
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accentViolet to-indigo-500 flex items-center justify-center text-xs font-semibold text-white shadow-md shadow-accentViolet/20">
              JD
            </div>
            <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">Julian Diaz</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] w-full mx-auto px-8 pt-7 pb-10 flex flex-col gap-8">
        {/* PageHeaderSection */}
        <section className="flex flex-col gap-4" data-purpose="report-header">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accentCyan glow-cyan-sm animate-pulse"></span>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-accentCyan">Career Intelligence / Analysis Report</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Your next move, <span className="bg-gradient-to-r from-accentCyan via-indigo-300 to-accentViolet bg-clip-text text-transparent">decoded.</span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Understand your alignment with the role, identify meaningful gaps, and turn your existing experience into stronger, grounded evidence.
              </p>
            </div>
            <button 
              onClick={async () => {
                setLoading(true);
                try {
                  const newAnalysis = await analysisService.analyzeApplication(application.id);
                  setAnalysis(newAnalysis);
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              New analysis
            </button>
          </div>
          <div className="mt-2 p-3 px-4 rounded-xl bg-surface border border-surfaceBorder backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs" data-purpose="metadata-bar">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Target Role:</span>
                <span className="text-slate-200 font-medium">{application.job_title}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Company:</span>
                <span className="text-slate-200 font-medium">{application.company}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Resume:</span>
                <span className="font-mono text-[11px] text-accentCyan bg-accentCyan/10 px-2 py-0.5 rounded border border-accentCyan/20">{application.resume_filename}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-accentEmerald">
              <span className="w-1.5 h-1.5 rounded-full bg-accentEmerald"></span>
              <span className="font-medium text-[11px]">Analysis complete</span>
            </div>
          </div>
        </section>

        {/* HeroOverallMatch */}
        <section className="p-6 md:p-7 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden" data-purpose="overall-match-hero">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-accentViolet/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 right-20 w-80 h-80 bg-accentCyan/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex items-center gap-6 border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-8">
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle className="stroke-white/10" cx="60" cy="60" fill="transparent" r="50" strokeWidth="9"></circle>
                  <circle className={`${strokeColor} transition-all duration-1000 ease-out`} cx="60" cy="60" fill="transparent" r="50" strokeDasharray="314.159" strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="9"></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{analysis.overall_score}<span className={`text-xl ${scoreColor} font-semibold`}>%</span></span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">Average Fit</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-semibold ${scoreColor} tracking-wider uppercase`}>Match Calibration</span>
                <h2 className="text-lg font-bold text-white mt-0.5">{analysis.score_explanation}</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {analysis.score_limitations}
                </p>
                <span className="text-[10px] text-slate-500 mt-2 font-mono flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  AI-generated estimate • Grounded in authentic resume facts
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400 font-medium">Skills Alignment</span>
                    <span className="text-xs font-bold text-accentCyan font-mono">{skillsScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-accentCyan to-indigo-500 h-full rounded-full" style={{width: `${skillsScore}%`}}></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Technical stack</span>
                  <span className="text-accentEmerald font-medium">{validSkills.length} validated</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400 font-medium">Experience Fit</span>
                    <span className="text-xs font-bold text-accentViolet font-mono">{expScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-accentViolet h-full rounded-full" style={{width: `${expScore}%`}}></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Domain context</span>
                  <span className="text-accentCyan font-medium">{expMatch} solid / {expMissing} missing</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400 font-medium">Keyword Coverage</span>
                    <span className="text-xs font-bold text-accentAmber font-mono">{keywordScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-accentViolet to-accentAmber h-full rounded-full" style={{width: `${keywordScore}%`}}></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">ATS terminology</span>
                  <span className="text-accentAmber font-medium">{keywordFound} found / {keywordTotal} total</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ReportTabBar */}
        <nav className="border-b border-white/10 flex items-center gap-8 text-xs font-medium overflow-x-auto whitespace-nowrap" data-purpose="report-tabs">
          <button className="pb-3 border-b-2 border-accentCyan text-white flex items-center gap-2 tracking-wide font-semibold">
            <span>Overview &amp; Breakdown</span>
          </button>
          <button className="pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-colors">
            <span>Skills Match</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] text-slate-300">{analysis.skills_alignment.length}</span>
          </button>
          <button className="pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-colors">
            <span>Recommendations</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] text-slate-300">{analysis.experience_requirements.recommendations.length}</span>
          </button>
          <button className="pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-colors">
            <span>Resume Improvements</span>
            <span className="px-1.5 py-0.2 rounded-full bg-accentViolet/20 text-accentViolet text-[10px] border border-accentViolet/30">{analysis.improvement_suggestions.length}</span>
          </button>
        </nav>

        {/* TwoColumnMainAnalysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-8 flex flex-col gap-6" data-purpose="skills-mapping-breakdown">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight">Your skills, mapped to the role</h2>
                <span className="text-xs text-slate-400 font-mono">{analysis.skills_alignment.length} calibrated points</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                See which job requirements your resume clearly supports, and where stronger evidence or terminology is recommended.
              </p>
            </div>

            {validSkills.length > 0 && (
              <div className="rounded-xl border border-accentEmerald/20 bg-accentEmerald/[0.02] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-accentEmerald/20 text-accentEmerald flex items-center justify-center text-xs">✓</span>
                    <span className="text-xs font-semibold text-slate-200">Demonstrated in resume</span>
                  </div>
                  <span className="text-[11px] font-mono text-accentEmerald uppercase tracking-wider">{validSkills.length} Validated</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {validSkills.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{skill.skill}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          skill.importance === 'core' ? 'text-accentCyan bg-accentCyan/10' :
                          skill.importance === 'differentiator' ? 'text-accentEmerald bg-accentEmerald/10' :
                          'text-slate-400 bg-white/5'
                        }`}>
                          {skill.importance}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        {skill.evidence || skill.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {partialSkills.length > 0 && (
              <div className="rounded-xl border border-accentAmber/25 bg-accentAmber/[0.02] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-accentAmber/20 text-accentAmber flex items-center justify-center text-xs">◐</span>
                    <span className="text-xs font-semibold text-slate-200">Partial evidence / Implicit context</span>
                  </div>
                  <span className="text-[11px] font-mono text-accentAmber uppercase tracking-wider">{partialSkills.length} Clarifications</span>
                </div>
                <div className="space-y-2.5">
                  {partialSkills.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="max-w-lg">
                        <span className="text-xs font-bold text-white">{skill.skill}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {skill.explanation || skill.evidence}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-accentAmber/10 text-accentAmber border border-accentAmber/20 font-medium">
                        Add context
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missingSkills.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-slate-400 flex items-center justify-center text-xs">○</span>
                    <span className="text-xs font-semibold text-slate-200">No direct mention found</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{missingSkills.length} Gaps detected</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {missingSkills.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/[0.015] border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{skill.skill}</span>
                        <span className="text-[10px] text-slate-500 font-mono capitalize">{skill.importance}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {skill.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-[11px] text-slate-400">
              <svg className="w-4 h-4 text-accentCyan shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>
                <strong>ApplyIQ Clarity Standard:</strong> We distinguish strictly between skills totally missing from your resume versus skills you have worked on that simply need sharper phrasing. Never claim tools you haven't used.
              </span>
            </div>
          </section>

          <aside className="lg:col-span-4 flex flex-col gap-4" data-purpose="biggest-opportunities">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-accentViolet/[0.07] to-white/[0.02] border border-accentViolet/20 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-accentViolet/20 flex items-center justify-center text-accentViolet">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-white">Your biggest opportunities</h3>
                </div>
                <span className="text-[10px] font-mono text-accentViolet bg-accentViolet/10 px-1.5 py-0.5 rounded">High Impact</span>
              </div>
              
              <div className="space-y-3.5">
                {analysis.experience_requirements.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accentViolet/40 transition-all">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <span className="text-[11px] font-mono text-accentCyan">0{idx + 1}</span>
                      <h4>Opportunity {idx + 1}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Total {analysis.experience_requirements.recommendations.length} actionable recommendations</span>
              </div>
            </div>
          </aside>
        </div>

        {analysis.improvement_suggestions.length > 0 && (
          <section className="p-6 md:p-7 rounded-2xl bg-gradient-to-br from-white/[0.04] to-accentViolet/[0.03] border border-white/10 backdrop-blur-xl flex flex-col gap-5" data-purpose="resume-improvement-preview">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accentCyan">Live Resume Studio Sample</span>
                  <span className="text-[10px] font-mono bg-accentCyan/10 text-accentCyan px-1.5 py-0.5 rounded border border-accentCyan/20">AI Rewrite Preview</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">Make your experience work harder</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Improve the clarity and impact of your actual experience without fabricating false claims.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accentViolet/20 hover:bg-accentViolet/30 text-accentViolet hover:text-white border border-accentViolet/30 text-xs font-semibold transition-all">
                <span>Open in Resume Studio</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>

            {analysis.improvement_suggestions.map((suggestion, idx) => (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch relative mt-2">
                <div className="p-4 rounded-xl bg-white/[0.015] border border-red-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-red-400/80 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Before (Your current bullet)
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">Section: {suggestion.section}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
                      "{suggestion.original_text || 'None'}"
                    </p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-accentCyan/[0.07] to-accentViolet/[0.07] border border-accentCyan/30 flex flex-col justify-between glow-cyan-sm">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-accentCyan font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accentCyan animate-ping"></span> Optimized Rewrite
                      </span>
                    </div>
                    <p className="text-xs text-white font-mono bg-[#090b16] p-3 rounded-lg border border-accentCyan/20 leading-relaxed">
                      "{suggestion.suggested_rewrite}"
                    </p>
                  </div>
                  <div className="mt-3 text-[11px] text-accentCyan flex items-center gap-1">
                    <span className="font-bold">Rationale:</span> {suggestion.rationale}
                  </div>
                </div>
              </div>
            ))}
            <div className="text-[11px] text-slate-500 text-center font-mono">
              Authentic ground truth policy: Always verify all metrics reflect your actual project outcomes before sharing with recruiters.
            </div>
          </section>
        )}
      </main>

      {/* StickyBottomActionDock */}
      <footer className="fixed bottom-0 right-0 left-[230px] border-t border-white/10 bg-midnight/90 backdrop-blur-xl px-8 py-3.5 z-40" data-purpose="sticky-action-dock">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <svg className="w-4 h-4 text-accentCyan shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span>All insights calibrated strictly to your resume facts • Zero hallucinated claims</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white border border-white/10 transition-colors">
              Track Application
            </button>
            <button className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white border border-white/10 transition-colors">
              Interview Prep
            </button>
            <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-accentViolet to-accentCyan text-white text-xs font-bold hover:brightness-110 shadow-lg shadow-accentCyan/20 transition-all flex items-center gap-1.5">
              <span>Apply Recommendations</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
