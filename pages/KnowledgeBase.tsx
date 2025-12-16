import React from 'react';
import { Database, Search, Network, Box, MapPin, Key } from 'lucide-react';

const KnowledgeBase = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Knowledge Base</h2>
          <p className="text-slate-500 mt-1">Graph-based entity relationships and business intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[600px]">
        {/* Sidebar Controls */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col">
           <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search entities..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
           </div>
           
           <div className="space-y-2">
             <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Node Types</p>
             <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg text-blue-800 cursor-pointer">
               <Box size={16} /> <span className="text-sm font-medium">Business Entities (4)</span>
             </div>
             <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg text-gray-600 cursor-pointer">
               <Key size={16} /> <span className="text-sm font-medium">Licenses (12)</span>
             </div>
             <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg text-gray-600 cursor-pointer">
               <MapPin size={16} /> <span className="text-sm font-medium">Locations (3)</span>
             </div>
           </div>
        </div>

        {/* Graph View (Visual Placeholder) */}
        <div className="col-span-9 bg-slate-900 rounded-xl shadow-lg relative overflow-hidden flex items-center justify-center">
           <div className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-lg backdrop-blur-sm text-xs text-slate-300">
             <p>Neo4j AuraDB Connection: <span className="text-green-400">Active</span></p>
           </div>
           
           {/* Pure CSS Visualization Placeholder */}
           <div className="relative w-full h-full">
              {/* Central Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50 z-10 hover:scale-110 transition-transform cursor-pointer">
                 <div className="text-white text-center">
                   <Box size={24} className="mx-auto mb-1" />
                   <span className="text-[10px] font-bold">Tripleswitch<br/>Brewing</span>
                 </div>
              </div>

              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="#475569" strokeWidth="2" />
                 <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#475569" strokeWidth="2" />
                 <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#475569" strokeWidth="2" />
              </svg>

              {/* Satellite Nodes */}
              <div className="absolute top-[30%] left-[20%] w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-lg z-10 cursor-pointer">
                 <Key size={20} className="text-white" />
              </div>
              <div className="absolute top-[32%] left-[20%] -translate-x-1/2 mt-16 text-slate-400 text-xs">TTB License</div>

              <div className="absolute top-[30%] right-[20%] w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg z-10 cursor-pointer">
                 <MapPin size={20} className="text-white" />
              </div>
              <div className="absolute top-[32%] right-[20%] -translate-x-1/2 mt-16 text-slate-400 text-xs">Fremont HQ</div>

              <div className="absolute bottom-[20%] left-[50%] -translate-x-1/2 w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center shadow-lg z-10 cursor-pointer">
                 <Network size={20} className="text-white" />
              </div>
              <div className="absolute bottom-[20%] left-[50%] -translate-x-1/2 mt-16 text-slate-400 text-xs">Supply Chain</div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
