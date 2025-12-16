import React, { useState, useRef } from 'react';
import { CURRENT_USER } from '../constants';
import { 
  FileText, 
  UploadCloud, 
  Check, 
  AlertCircle, 
  Loader2, 
  X, 
  Tag 
} from 'lucide-react';
import ClassificationBadge from './ClassificationBadge';
import { DocumentEntity, Classification } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (doc: DocumentEntity) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [classification, setClassification] = useState<Classification>(Classification.INTERNAL);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    // Simulate network delay
    setTimeout(() => {
        const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'FILE';
        const docType = ['PDF', 'DOCX', 'XLSX', 'IMG'].includes(fileExtension) ? fileExtension as any : 'PDF';

        const newDoc: DocumentEntity = {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: docType,
          classification: classification,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedAt: new Date().toISOString().split('T')[0],
          author: CURRENT_USER.name,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          currentVersion: 'v1.0',
          versions: [
            {
              id: `v-${Date.now()}`,
              versionNumber: 'v1.0',
              uploadedAt: new Date().toISOString().split('T')[0],
              uploadedBy: CURRENT_USER.name,
              fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              changeNote: 'Initial upload'
            }
          ]
        };

        onUpload(newDoc);
        setIsUploading(false);
        resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setFile(null);
    setClassification(Classification.INTERNAL);
    setTags('');
    setIsUploading(false);
    onClose();
  };

  const getClassificationDescription = (c: Classification) => {
    switch (c) {
      case Classification.PUBLIC: return "No restrictions. Available for external distribution.";
      case Classification.INTERNAL: return "Standard business data. Company personnel only.";
      case Classification.CONFIDENTIAL: return "Sensitive business data. Specific team access only.";
      case Classification.RESTRICTED: return "Critical sensitive data. Strict access control & audit logs.";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-slate-900 flex items-center">
            <UploadCloud className="mr-2 text-blue-600" size={20} />
            Upload New Document
          </h3>
          <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!file ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect} 
              />
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud size={32} />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-1">Drag and drop your file here</p>
              <p className="text-sm text-slate-500 mb-6">PDF, DOCX, XLSX, or Images (max 10MB)</p>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-white border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Browse Files
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-md text-blue-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)} 
                  className="text-slate-400 hover:text-red-500"
                  disabled={isUploading}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Classification System */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center">
                  Data Classification Level
                  <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Required</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(Classification).map((c) => (
                    <div 
                      key={c}
                      onClick={() => !isUploading && setClassification(c)}
                      className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                        classification === c 
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <ClassificationBadge level={c} />
                        {classification === c && <Check size={16} className="text-blue-600" />}
                      </div>
                      <p className="text-xs text-slate-500 leading-tight mt-2">
                        {getClassificationDescription(c)}
                      </p>
                    </div>
                  ))}
                </div>
                {classification === Classification.RESTRICTED && (
                   <div className="mt-3 flex items-start p-3 bg-amber-50 text-amber-800 rounded-lg text-xs">
                      <AlertCircle size={14} className="mr-2 mt-0.5 shrink-0" />
                      <span>Uploading <strong>Restricted</strong> data triggers an automatic compliance audit log and requires enhanced encryption.</span>
                   </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. Finance, Q1, Contracts (comma separated)"
                    className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center ${isUploading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} className="mr-2" /> Upload Document
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;