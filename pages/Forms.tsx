import React, { useState, useEffect, useRef } from 'react';
import { MOCK_FORMS, MOCK_SMART_FILL_FIELDS, CURRENT_USER } from '../constants';
import { FormSubmission, FormStatus, Classification, FormField } from '../types';
import ClassificationBadge from '../components/ClassificationBadge';
import { 
  FileUp, 
  BrainCircuit, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  FileText,
  RotateCcw,
  Save,
  Loader2,
  ChevronDown,
  UserCheck,
  XCircle,
  Clock,
  ShieldCheck,
  X,
  AlertTriangle
} from 'lucide-react';

// --- Sub-components for Form Workflow ---

const FormUpload = ({ onAnalyze }: { onAnalyze: () => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          {file ? <FileText size={32} /> : <FileUp size={32} />}
        </div>
        
        {file ? (
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{file.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
            <div className="flex justify-center space-x-3">
               <button 
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={onAnalyze}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-900/20 flex items-center"
              >
                <BrainCircuit size={18} className="mr-2" />
                Analyze & Smart Fill
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload a Form</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Drag and drop your PDF form here, or click to browse. Supported formats: PDF, DOCX.
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Browse Files
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect} 
              accept=".pdf,.docx" 
            />
          </div>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: BrainCircuit, title: "AI Analysis", desc: "Auto-detects fields and context" },
          { icon: FileText, title: "Smart Fill", desc: "Populates data from Knowledge Base" },
          { icon: CheckCircle, title: "Compliance Check", desc: "Validates against TTB rules" }
        ].map((feat, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 flex items-start space-x-3">
            <feat.icon className="text-blue-600 shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-sm text-slate-900">{feat.title}</h4>
              <p className="text-xs text-slate-500">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SmartFillLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const steps = [
    "Uploading document securely...",
    "Scanning document structure (OCR)...",
    "Identifying form fields...",
    "Querying Knowledge Base (Neo4j)...",
    "Mapping entities to fields...",
    "Applying Smart-Fill logic..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        // Increment step based on progress milestones
        if (old > 15 && step === 0) setStep(1);
        if (old > 35 && step === 1) setStep(2);
        if (old > 55 && step === 2) setStep(3);
        if (old > 75 && step === 3) setStep(4);
        if (old > 90 && step === 4) setStep(5);
        return old + 1;
      });
    }, 40); // 4 seconds total roughly
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-24 h-24 mb-6">
        <svg className="animate-spin text-blue-600 w-full h-full" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Document</h3>
      <p className="text-slate-500 mb-8 w-64 text-center h-6">{steps[step]}</p>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const SmartReview = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (fields: FormField[]) => void }) => {
  const [fields, setFields] = useState<FormField[]>(MOCK_SMART_FILL_FIELDS);

  const handleFieldChange = (id: string, newVal: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, value: newVal, isEdited: true, confidence: 1.0 } : f));
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return "bg-green-500";
    if (score >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Review & Edit</h2>
          <div className="flex items-center space-x-2 mt-1">
             <span className="text-sm text-slate-500">TTB F 5130.9 Brewer's Report of Operations</span>
             <ClassificationBadge level={Classification.RESTRICTED} />
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
            <RotateCcw size={16} className="mr-2" /> Discard
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
            <Save size={16} className="mr-2" /> Save Draft
          </button>
          <button onClick={() => onSubmit(fields)} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center">
            Submit for Approval <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: PDF Preview (Mock) */}
        <div className="flex-1 bg-slate-800 rounded-xl overflow-hidden flex flex-col shadow-inner">
          <div className="bg-slate-900 p-2 flex justify-between items-center px-4 text-white border-b border-slate-700">
             <span className="text-xs font-mono">Page 1 of 4</span>
             <div className="flex space-x-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
          </div>
          <div className="flex-1 bg-gray-500 flex items-center justify-center p-8 overflow-y-auto">
             {/* PDF Placeholder Visualization */}
             <div className="bg-white w-full h-[800px] shadow-2xl relative p-12 text-xs text-slate-300 select-none">
                <div className="w-full h-8 bg-slate-100 mb-8"></div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="h-4 bg-slate-100 w-3/4"></div>
                  <div className="h-4 bg-slate-100 w-1/2"></div>
                </div>
                {/* Simulated Highlight Overlay */}
                <div className="absolute top-[180px] left-[40px] w-[200px] h-[30px] border-2 border-blue-500 bg-blue-500/10 rounded flex items-center justify-center">
                   <div className="bg-blue-600 text-white text-[10px] px-1 absolute -top-4 left-0">Business Name</div>
                </div>
                 <div className="space-y-4">
                   {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="h-2 bg-slate-50 w-full"></div>)}
                 </div>
             </div>
          </div>
        </div>

        {/* Right: Smart Fields Form */}
        <div className="w-[450px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-blue-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center">
              <BrainCircuit size={18} className="text-blue-600 mr-2" />
              Smart-Filled Data
            </h3>
            <p className="text-xs text-slate-500 mt-1">Review the extracted data against the Knowledge Base.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {fields.map((field) => (
              <div key={field.id} className="relative group">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex items-center space-x-2 tooltip" title={`Confidence: ${(field.confidence * 100).toFixed(0)}%`}>
                     <span className="text-[10px] text-slate-400">{(field.confidence * 100).toFixed(0)}% Match</span>
                     <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <div 
                        className={`h-full ${getConfidenceColor(field.confidence)}`} 
                        style={{ width: `${field.confidence * 100}%`}}
                       />
                     </div>
                  </div>
                </div>
                
                <div className="relative">
                   <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className={`w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      field.isEdited ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-white border-gray-300 text-gray-900'
                    } ${field.confidence < 0.7 && !field.isEdited ? 'border-red-300 bg-red-50' : ''}`}
                  />
                  {field.originalValue && (
                     <div className="text-xs text-orange-600 mt-1 flex items-center">
                       <AlertCircle size={12} className="mr-1" />
                       Mismatch. Knowledge Base has: <span className="font-mono ml-1">{field.originalValue}</span>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-center text-gray-500">
            Changes are automatically logged to the audit trail.
          </div>
        </div>
      </div>
    </div>
  );
};

const FormApproval = ({ form, onBack, onDecision }: { form: FormSubmission, onBack: () => void, onDecision: (status: FormStatus) => void }) => {
  // Use fields from form if available, otherwise mock them for the demo since the initial mocks are empty
  const displayFields = form.fields.length > 0 ? form.fields : MOCK_SMART_FILL_FIELDS;
  const isPending = form.status === FormStatus.PENDING_APPROVAL;
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col relative">
      {/* Reject Confirmation Modal */}
      {showRejectConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reject Form?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to reject <span className="font-medium text-slate-900">{form.name}</span>? This action will return it to the submitter and cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowRejectConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDecision(FormStatus.REJECTED);
                  setShowRejectConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
             <ArrowRight className="rotate-180" size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{form.name}</h2>
            <div className="flex items-center space-x-3 mt-1">
               <span className="text-sm text-slate-500">{form.templateName}</span>
               <span className="text-gray-300">•</span>
               <span className="text-sm text-slate-500 flex items-center"><UserCheck size={14} className="mr-1"/> {form.submittedBy}</span>
               <span className="text-gray-300">•</span>
               <ClassificationBadge level={form.classification} />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isPending ? (
            <>
              <button 
                onClick={() => setShowRejectConfirm(true)} 
                className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center transition-colors"
              >
                <XCircle size={16} className="mr-2" /> Reject
              </button>
              <button 
                onClick={() => onDecision(FormStatus.APPROVED)} 
                className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm flex items-center transition-colors"
              >
                <CheckCircle size={16} className="mr-2" /> Approve Request
              </button>
            </>
          ) : (
             <div className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center border ${
               form.status === FormStatus.APPROVED 
                 ? 'bg-green-50 text-green-700 border-green-200' 
                 : 'bg-red-50 text-red-700 border-red-200'
             }`}>
                {form.status === FormStatus.APPROVED ? <CheckCircle size={16} className="mr-2"/> : <XCircle size={16} className="mr-2"/>}
                {form.status === FormStatus.APPROVED ? 'Approved' : 'Rejected'}
             </div>
          )}
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: PDF Preview (Mock) */}
        <div className="flex-1 bg-slate-800 rounded-xl overflow-hidden flex flex-col shadow-inner">
          <div className="bg-slate-900 p-2 flex justify-between items-center px-4 text-white border-b border-slate-700">
             <span className="text-xs font-mono">Page 1 of 4</span>
             <div className="flex space-x-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
          </div>
          <div className="flex-1 bg-gray-500 flex items-center justify-center p-8 overflow-y-auto">
             <div className="bg-white w-full h-[800px] shadow-2xl relative p-12 text-xs text-slate-300 select-none">
                <div className="w-full h-8 bg-slate-100 mb-8"></div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="h-4 bg-slate-100 w-3/4"></div>
                  <div className="h-4 bg-slate-100 w-1/2"></div>
                </div>
                 <div className="space-y-4">
                   {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="h-2 bg-slate-50 w-full"></div>)}
                 </div>
                 {/* Stamp for Approved/Rejected */}
                 {!isPending && (
                   <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-double rounded px-8 py-4 text-4xl font-black uppercase transform -rotate-12 opacity-80 ${
                     form.status === FormStatus.APPROVED ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'
                   }`}>
                     {form.status}
                   </div>
                 )}
             </div>
          </div>
        </div>

        {/* Right: Read-only Fields */}
        <div className="w-[400px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-slate-900 flex items-center">
              <FileText size={18} className="text-slate-500 mr-2" />
              Form Data
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {displayFields.map((field) => (
              <div key={field.id} className="relative group">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  {field.label}
                </label>
                <div className="p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                  {field.value}
                </div>
                {field.originalValue && isPending && (
                   <div className="text-xs text-orange-600 mt-1 flex items-center">
                     <AlertCircle size={12} className="mr-1" />
                     Modified from source
                   </div>
                )}
              </div>
            ))}
          </div>
          
          {isPending && (
            <div className="p-4 bg-blue-50 border-t border-blue-100">
               <div className="flex items-start">
                  <ShieldCheck className="text-blue-600 shrink-0 mt-0.5 mr-2" size={16} />
                  <div>
                    <p className="text-xs font-bold text-blue-800">Compliance Check Passed</p>
                    <p className="text-[10px] text-blue-600 mt-0.5">All mandatory fields are present. Data types match TTB specifications.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const Forms = () => {
  const [formsList, setFormsList] = useState<FormSubmission[]>(MOCK_FORMS);
  const [view, setView] = useState<'list' | 'upload' | 'processing' | 'review' | 'approval'>('list');
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  const selectedForm = formsList.find(f => f.id === selectedFormId);

  const handleStartUpload = () => setView('upload');
  const handleAnalyze = () => setView('processing');
  const handleProcessingComplete = () => setView('review');
  
  const handleSubmitNewForm = (fields: FormField[]) => {
    const newSubmission: FormSubmission = {
      id: `sub-${Date.now()}`,
      name: "New TTB Report Submission",
      templateName: "TTB F 5130.9",
      status: FormStatus.PENDING_APPROVAL,
      submittedBy: CURRENT_USER.name,
      submittedAt: new Date().toISOString().split('T')[0],
      classification: Classification.RESTRICTED,
      riskLevel: 'LOW',
      fields: fields
    };
    setFormsList(prev => [newSubmission, ...prev]);
    setView('list');
    
    // Trigger success notification
    setNotification({
      title: "Submission Successful",
      message: "Your form has been queued for review. Expected turnaround: 24-48 hours."
    });
    
    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleViewForm = (id: string) => {
    setSelectedFormId(id);
    setView('approval');
  };

  const handleApprovalDecision = (status: FormStatus) => {
    if (selectedFormId) {
      setFormsList(prev => prev.map(f => f.id === selectedFormId ? { ...f, status } : f));
      // Keep staying on the page to show the stamp/result, or go back?
      // Let's just update the local state so the UI reflects it immediately.
    }
  };

  if (view === 'upload') return <FormUpload onAnalyze={handleAnalyze} />;
  if (view === 'processing') return <SmartFillLoader onComplete={handleProcessingComplete} />;
  if (view === 'review') return <SmartReview onBack={() => setView('list')} onSubmit={handleSubmitNewForm} />;
  if (view === 'approval' && selectedForm) {
    return (
      <FormApproval 
        form={selectedForm} 
        onBack={() => { setView('list'); setSelectedFormId(null); }} 
        onDecision={handleApprovalDecision} 
      />
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white rounded-lg shadow-xl p-4 flex items-start space-x-3 max-w-sm border border-slate-700">
            <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="text-sm font-bold">{notification.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Forms Engine</h2>
          <p className="text-slate-500 mt-1">Automated form processing, compliance checks, and approvals.</p>
        </div>
        <button 
          onClick={handleStartUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center"
        >
          <FileUp size={16} className="mr-2" /> Start New Form
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs text-slate-500 font-bold uppercase">Pending My Approval</p>
             <p className="text-2xl font-bold text-slate-900 mt-1">
               {formsList.filter(f => f.status === FormStatus.PENDING_APPROVAL).length}
             </p>
           </div>
           <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
             <AlertCircle size={20} />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs text-slate-500 font-bold uppercase">Approved This Week</p>
             <p className="text-2xl font-bold text-slate-900 mt-1">
               {formsList.filter(f => f.status === FormStatus.APPROVED).length}
             </p>
           </div>
           <div className="p-2 bg-green-100 text-green-600 rounded-lg">
             <CheckCircle size={20} />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 font-medium text-slate-700">
          Active Forms
        </div>
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Form Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Classification</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {formsList.map((form) => (
              <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded mr-3">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{form.name}</p>
                      <p className="text-xs text-gray-500">{form.templateName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    form.status === FormStatus.APPROVED ? 'bg-green-100 text-green-800' :
                    form.status === FormStatus.PENDING_APPROVAL ? 'bg-orange-100 text-orange-800' :
                    form.status === FormStatus.REJECTED ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {form.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{form.submittedBy}</td>
                <td className="px-6 py-4">
                  <ClassificationBadge level={form.classification} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleViewForm(form.id)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Forms;