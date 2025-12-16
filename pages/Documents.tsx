import React, { useState, useRef } from 'react';
import { RECENT_DOCUMENTS, CURRENT_USER } from '../constants';
import { 
  FileText, 
  MoreVertical, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Plus, 
  X, 
  Tag, 
  Share2, 
  File, 
  ChevronRight, 
  Clock, 
  FileType, 
  FileSpreadsheet, 
  Image as ImageIcon,
  History,
  RotateCcw,
  UploadCloud,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import ClassificationBadge from '../components/ClassificationBadge';
import UploadModal from '../components/UploadModal';
import { DocumentEntity, DocumentVersion, Classification } from '../types';

// --- Main Component ---

const Documents = () => {
  const [documents, setDocuments] = useState(RECENT_DOCUMENTS);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTagValue, setNewTagValue] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentEntity | null>(null);
  
  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Derive all unique tags from current documents
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags))).sort() as string[];
  // Derive all unique types from current documents
  const allTypes = Array.from(new Set(documents.map(doc => doc.type))).sort() as string[];

  const getFileIcon = (type: string, size: number) => {
    switch (type) {
      case 'PDF': return <FileText size={size} />;
      case 'DOCX': return <FileText size={size} />; // Using FileText for DOCX as well
      case 'XLSX': return <FileSpreadsheet size={size} />;
      case 'IMG': return <ImageIcon size={size} />;
      default: return <File size={size} />;
    }
  };

  const handleFilterToggle = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleTypeFilterToggle = (type: string) => {
    setFilterTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleRemoveTag = (docId: string, tagToRemove: string) => {
    setDocuments(prevDocs => prevDocs.map(doc => {
      if (doc.id === docId) {
        return { ...doc, tags: doc.tags.filter(t => t !== tagToRemove) };
      }
      return doc;
    }));
  };

  const startAddingTag = (docId: string) => {
    setEditingId(docId);
    setNewTagValue("");
  };

  const saveNewTag = () => {
    if (editingId && newTagValue.trim()) {
      const tag = newTagValue.trim();
      setDocuments(prevDocs => prevDocs.map(doc => {
        if (doc.id === editingId && !doc.tags.includes(tag)) {
          return { ...doc, tags: [...doc.tags, tag] };
        }
        return doc;
      }));
    }
    setEditingId(null);
    setNewTagValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveNewTag();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleRevert = (docId: string, version: DocumentVersion) => {
    if (!confirm(`Are you sure you want to revert to ${version.versionNumber}?`)) return;

    setDocuments(prevDocs => prevDocs.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          currentVersion: version.versionNumber,
          size: version.fileSize,
          uploadedAt: version.uploadedAt,
          author: version.uploadedBy,
          // In a real application, you would also fetch/revert the actual content here
        };
      }
      return doc;
    }));

    // Update the local selected state to reflect changes immediately
    setSelectedDoc(prev => prev ? {
      ...prev,
      currentVersion: version.versionNumber,
      size: version.fileSize,
      uploadedAt: version.uploadedAt,
      author: version.uploadedBy,
    } : null);
  };

  const handleNewUpload = (newDoc: DocumentEntity) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesTags = filterTags.length === 0 || filterTags.every(tag => doc.tags.includes(tag));
    const matchesTypes = filterTypes.length === 0 || filterTypes.includes(doc.type);
    return matchesTags && matchesTypes;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={handleNewUpload} 
      />

      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Repository</h2>
          <p className="text-slate-500 mt-1">Manage and secure business critical files.</p>
        </div>
        <div className="flex space-x-2 relative">
          
          {/* Type Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center transition-colors ${
                isTypeFilterOpen || filterTypes.length > 0 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileType size={16} className="mr-2" /> 
              {filterTypes.length > 0 ? `Types (${filterTypes.length})` : 'Type'}
            </button>
            
            {isTypeFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 pt-1">Filter by Type</div>
                <div className="max-h-48 overflow-y-auto">
                  {allTypes.map(type => (
                    <label key={type} className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filterTypes.includes(type)}
                        onChange={() => handleTypeFilterToggle(type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" 
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                  {allTypes.length === 0 && (
                    <div className="px-2 py-2 text-sm text-gray-500 italic">No types available</div>
                  )}
                </div>
                {filterTypes.length > 0 && (
                  <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                    <button 
                      onClick={() => setFilterTypes([])}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium w-full text-left"
                    >
                      Clear type filters
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {isTypeFilterOpen && (
              <div className="fixed inset-0 z-10" onClick={() => setIsTypeFilterOpen(false)}></div>
            )}
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center transition-colors ${
                isFilterOpen || filterTags.length > 0 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} className="mr-2" /> 
              {filterTags.length > 0 ? `Tags (${filterTags.length})` : 'Tags'}
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 pt-1">Filter by Tag</div>
                <div className="max-h-48 overflow-y-auto">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filterTags.includes(tag)}
                        onChange={() => handleFilterToggle(tag)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" 
                      />
                      <span className="text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                  {allTags.length === 0 && (
                    <div className="px-2 py-2 text-sm text-gray-500 italic">No tags available</div>
                  )}
                </div>
                {filterTypes.length > 0 && (
                  <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                    <button 
                      onClick={() => setFilterTags([])}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium w-full text-left"
                    >
                      Clear tag filters
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {isFilterOpen && (
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
            )}
          </div>
          
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center"
          >
            Upload New
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
         {/* Document List Panel - Always Full Width */}
         <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full transition-all duration-300">
            <div className="flex-none p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-4">
               {/* Search bar */}
               <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search documents..." 
                   className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                 />
               </div>
               <div className="text-sm text-gray-500 font-medium whitespace-nowrap hidden sm:block">
                 {filteredDocuments.length} files
               </div>
            </div>

            <div className="flex-1 overflow-auto">
               <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">
                           <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Security</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                     {filteredDocuments.map(doc => (
                        <tr 
                          key={doc.id} 
                          onClick={() => setSelectedDoc(doc)}
                          className="group cursor-pointer hover:bg-blue-50 transition-colors"
                        >
                           <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                             <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center">
                                 <div className="p-2 bg-slate-100 text-slate-600 rounded-lg mr-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    {getFileIcon(doc.type, 18)}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.size}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex flex-wrap gap-1">
                               {doc.tags.slice(0, 3).map(tag => (
                                 <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200 group-hover:bg-white">
                                    {tag}
                                 </span>
                               ))}
                               {doc.tags.length > 3 && <span className="text-xs text-gray-400">+{doc.tags.length - 3}</span>}
                             </div>
                           </td>
                           <td className="px-6 py-4">
                              <ClassificationBadge level={doc.classification} />
                           </td>
                           <td className="px-6 py-4 text-xs font-mono text-gray-500">
                              {doc.type}
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center">
                                 <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-2">
                                  {doc.author.charAt(0)}
                                 </div>
                                 <span className="text-sm text-gray-600">{doc.author.split(' ')[0]}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="p-1 hover:text-blue-600" title="Preview"><Eye size={16} /></button>
                                 <button className="p-1 hover:text-blue-600" title="Download"><Download size={16} /></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ margin: 0 }}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDoc(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             {/* Modal Header */}
             <div className="flex-none px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-20">
                <div className="flex items-center space-x-4">
                   <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      {getFileIcon(selectedDoc.type, 24)}
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedDoc.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 flex items-center">
                        <span className="font-medium text-gray-700">{selectedDoc.author}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span>{selectedDoc.uploadedAt}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span>{selectedDoc.size}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-mono font-medium">{selectedDoc.currentVersion}</span>
                      </p>
                   </div>
                </div>
                <div className="flex items-center space-x-2">
                   <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download size={20} />
                   </button>
                   <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 size={20} />
                   </button>
                   <div className="w-px h-6 bg-gray-200 mx-2"></div>
                   <button onClick={() => setSelectedDoc(null)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <X size={24} />
                   </button>
                </div>
             </div>

             {/* Modal Body */}
             <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Preview) */}
                <div className="flex-1 bg-slate-50 overflow-y-auto p-8 flex justify-center">
                   <div className="bg-white shadow-sm border border-gray-200 min-h-[800px] w-full max-w-3xl p-12 relative flex flex-col">
                      {/* Background Icon */}
                      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                         {getFileIcon(selectedDoc.type, 200)}
                      </div>
                      
                      {/* Content Preview Logic */}
                      {selectedDoc.type === 'XLSX' ? (
                        <div className="w-full overflow-hidden border border-gray-200 rounded-lg bg-white relative z-10">
                          <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-200">
                            <div className="col-span-1 p-2 border-r border-gray-200 text-center text-xs font-bold text-gray-500">#</div>
                            <div className="col-span-3 p-2 border-r border-gray-200 text-xs font-bold text-gray-500">A</div>
                            <div className="col-span-3 p-2 border-r border-gray-200 text-xs font-bold text-gray-500">B</div>
                            <div className="col-span-3 p-2 border-r border-gray-200 text-xs font-bold text-gray-500">C</div>
                            <div className="col-span-2 p-2 text-xs font-bold text-gray-500">D</div>
                          </div>
                          {[...Array(20)].map((_, i) => (
                            <div key={i} className="grid grid-cols-12 border-b border-gray-100 last:border-0 hover:bg-blue-50/50">
                               <div className="col-span-1 p-2 border-r border-gray-100 bg-gray-50 text-center text-xs text-gray-400 font-mono">{i+1}</div>
                               <div className="col-span-3 p-2 border-r border-gray-100 text-xs text-gray-400 bg-gray-50/30"></div>
                               <div className="col-span-3 p-2 border-r border-gray-100 text-xs text-gray-400"></div>
                               <div className="col-span-3 p-2 border-r border-gray-100 text-xs text-gray-400 bg-gray-50/30"></div>
                               <div className="col-span-2 p-2 text-xs text-gray-400"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-8 animate-pulse-slow">
                          <div className="h-8 bg-gray-100 rounded w-3/4 mb-12"></div>
                          <div className="space-y-4">
                             <div className="h-3 bg-gray-100 rounded w-full"></div>
                             <div className="h-3 bg-gray-100 rounded w-full"></div>
                             <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-8 my-12">
                             <div className="h-32 bg-gray-100 rounded"></div>
                             <div className="space-y-4">
                                <div className="h-3 bg-gray-100 rounded w-full"></div>
                                <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                                <div className="h-3 bg-gray-100 rounded w-full"></div>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="h-3 bg-gray-100 rounded w-full"></div>
                             <div className="h-3 bg-gray-100 rounded w-11/12"></div>
                             <div className="h-3 bg-gray-100 rounded w-full"></div>
                             <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                          </div>
                        </div>
                      )}
                   </div>
                </div>

                {/* Sidebar: Metadata & Tags */}
                <div className="w-80 bg-white border-l border-gray-100 flex flex-col overflow-y-auto z-10 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)]">
                   <div className="p-6 space-y-8">
                      <div>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Classification</h4>
                         <ClassificationBadge level={selectedDoc.classification} size="md" />
                      </div>

                      <div>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tags</h4>
                         <div className="flex flex-wrap gap-2">
                            {selectedDoc.tags.map(tag => (
                               <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 group">
                                  {tag}
                                  <button onClick={() => handleRemoveTag(selectedDoc.id, tag)} className="ml-1.5 text-indigo-400 hover:text-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                               </span>
                            ))}
                            {editingId === selectedDoc.id ? (
                              <input 
                                type="text" 
                                autoFocus
                                className="w-full px-3 py-1.5 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="New tag..."
                                value={newTagValue}
                                onChange={(e) => setNewTagValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={saveNewTag}
                              />
                            ) : (
                              <button onClick={() => startAddingTag(selectedDoc.id)} className="flex items-center px-2.5 py-1 rounded-md text-sm font-medium border border-dashed border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all">
                                 <Plus size={14} className="mr-1.5" /> Add Tag
                              </button>
                            )}
                         </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                          <History size={14} className="mr-2" /> Version History
                        </h4>
                        <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-gray-200">
                          {selectedDoc.versions && selectedDoc.versions.map((version, idx) => {
                            const isCurrent = version.versionNumber === selectedDoc.currentVersion;
                            return (
                              <div key={version.id} className="relative pl-10 py-3 first:pt-0">
                                <div className={`absolute left-2 top-3.5 w-3 h-3 rounded-full border-2 ${isCurrent ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}></div>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className={`text-sm font-bold ${isCurrent ? 'text-blue-600' : 'text-gray-900'}`}>{version.versionNumber}</span>
                                      {isCurrent && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium">Current</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{version.uploadedAt}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">by {version.uploadedBy.split(' ')[0]}</p>
                                    {version.changeNote && (
                                      <p className="text-xs text-gray-600 mt-2 italic">"{version.changeNote}"</p>
                                    )}
                                  </div>
                                  {!isCurrent && (
                                    <button 
                                      onClick={() => handleRevert(selectedDoc.id, version)}
                                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" 
                                      title="Revert to this version"
                                    >
                                      <RotateCcw size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">File Details</h4>
                         <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                               <dt className="text-gray-500">Type</dt>
                               <dd className="font-medium text-gray-900">{selectedDoc.type}</dd>
                            </div>
                            <div className="flex justify-between">
                               <dt className="text-gray-500">Size</dt>
                               <dd className="font-medium text-gray-900">{selectedDoc.size}</dd>
                            </div>
                            <div className="flex justify-between">
                               <dt className="text-gray-500">Owner</dt>
                               <dd className="font-medium text-gray-900">{selectedDoc.author.split(' ')[0]}</dd>
                            </div>
                            <div className="flex justify-between">
                               <dt className="text-gray-500">Created</dt>
                               <dd className="font-medium text-gray-900">{selectedDoc.uploadedAt}</dd>
                            </div>
                         </dl>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;