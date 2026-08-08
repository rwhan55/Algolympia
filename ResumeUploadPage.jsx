import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  CheckCircle2,
  Trash2,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  Play,
  FileCode2,
  AlertCircle
} from 'lucide-react';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Skeleton from '../components/common/Skeleton';
import Toast from '../components/common/Toast';
import { resumeApi } from '../services/resumeApi';
import { useInterview } from '../context/InterviewContext';

export const ResumeUploadPage = () => {
  const [resumes, setResumes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { setResumeData } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await resumeApi.getResumes();
      setResumes(data);
      if (data.length > 0) {
        setResumeData(data[0].analysis);
      }
    } catch {
      // ignore
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Invalid file format. Only PDF documents are supported for PyMuPDF extraction.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10 MB limit.');
      return;
    }

    setErrorMsg('');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await resumeApi.uploadResume(file, (percent) => {
        setUploadProgress(percent);
      });

      await loadResumes();
      setToast({
        isVisible: true,
        message: 'Resume analyzed successfully by PyMuPDF & Llama!',
        type: 'success'
      });
    } catch (err) {
      setErrorMsg(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await resumeApi.deleteResume(id);
    await loadResumes();
    setToast({
      isVisible: true,
      message: 'Resume deleted successfully.',
      type: 'info'
    });
  };

  const currentResume = resumes[0] || null;
  const analysis = currentResume?.analysis || null;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
            Resume Analysis & Parsing Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload your technical PDF resume. Backend PyMuPDF extracts experience, skills & frameworks to customize AI interview questions.
          </p>
        </div>

        {analysis && (
          <Button
            variant="primary"
            icon={Play}
            onClick={() => navigate('/interview')}
          >
            Start Tailored Interview
          </Button>
        )}
      </div>

      {/* Main Upload Dropzone */}
      <Card>
        <CardHeader
          title="Upload Technical PDF Resume"
          subtitle="Supports PDF documents up to 10 MB. Maximize match accuracy with projects and work experience."
        />

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-lg">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-200">
                Drag and drop your PDF resume here, or <span className="text-cyan-400 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">PyMuPDF Text & Structural Parsing Engine</p>
            </div>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                Parsing PDF & Running Llama Skill Extraction...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <ProgressBar progress={uploadProgress} color="cyan" showLabel={false} />
          </div>
        )}
      </Card>

      {/* Extracted Resume Details & Analysis Section */}
      {currentResume && analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Card & Suggested Difficulty */}
          <div className="space-y-6">
            <Card>
              <CardHeader title="Current Resume Document" />
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 truncate max-w-[150px] sm:max-w-[200px]">
                      {currentResume.fileName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{currentResume.fileSize} • Uploaded {currentResume.uploadedAt}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(currentResume.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Difficulty Recommendation Badge */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-900 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Recommended Difficulty</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-purple-500 text-slate-950">
                    {analysis.suggestedDifficulty}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Based on experience depth and system architecture projects found in your PDF resume.
                </p>
              </div>
            </Card>

            {/* Candidate Info Summary */}
            <Card>
              <CardHeader title="Candidate Info" />
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Name</span>
                  <span className="font-bold text-slate-200">{analysis.candidateName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Email</span>
                  <span className="font-mono text-cyan-400">{analysis.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Match Score</span>
                  <span className="font-bold text-emerald-400">{analysis.matchScore}% Match</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Technical Skills & Experience Highlights */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader
                title="Extracted Technical Skills & Frameworks"
                subtitle="Llama model extracted these core competencies from your resume."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader
                title="Work Experience Highlights"
                subtitle="Parsed positions and achievements."
              />
              <div className="space-y-4">
                {analysis.experience.map((exp, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-cyan-400" /> {exp.role}
                      </h4>
                      <span className="text-xs font-mono text-slate-400">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-cyan-300">{exp.company}</p>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pt-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* Projects & Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader title="Featured Projects" />
                <div className="space-y-3">
                  {analysis.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <p className="font-bold text-slate-200 flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-purple-400" /> {proj.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.tech.map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="Education & Certifications" />
                <div className="space-y-3 text-xs">
                  {analysis.education.map((edu, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <p className="font-bold text-slate-200 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> {edu.degree}
                      </p>
                      <p className="text-slate-400">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> Certifications
                    </p>
                    {analysis.certifications.map((c, i) => (
                      <p key={i} className="text-slate-400 text-[11px]">• {c}</p>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <div className="p-8 text-center space-y-3">
            <Skeleton variant="card" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ResumeUploadPage;
