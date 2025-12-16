import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { DASHBOARD_METRICS, MOCK_FORMS, RECENT_DOCUMENTS } from '../constants';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  FileCheck, 
  AlertTriangle, 
  FileText, 
  Clock, 
  Loader2, 
  CheckCircle, 
  X,
  Download,
  FileBarChart
} from 'lucide-react';
import ClassificationBadge from '../components/ClassificationBadge';
import UploadModal from '../components/UploadModal';
import { DocumentEntity } from '../types';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Mon', forms: 4, docs: 12 },
  { name: 'Tue', forms: 3, docs: 15 },
  { name: 'Wed', forms: 7, docs: 8 },
  { name: 'Thu', forms: 2, docs: 20 },
  { name: 'Fri', forms: 6, docs: 14 },
  { name: 'Sat', forms: 1, docs: 4 },
  { name: 'Sun', forms: 0, docs: 2 },
];

const complianceData = [
  { name: 'Week 1', score: 92 },
  { name: 'Week 2', score: 94 },
  { name: 'Week 3', score: 91 },
  { name: 'Week 4', score: 98 },
];

const MetricCard: React.FC<{ metric: any }> = ({ metric }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-slate-500 text-sm font-medium mb-2">{metric.label}</h3>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-slate-900">{metric.value}</span>
      <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${metric.trend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {metric.trend >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {Math.abs(metric.trend)}% {metric.trendLabel}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [recentDocs, setRecentDocs] = useState<DocumentEntity[]>(RECENT_DOCUMENTS);
  const navigate = useNavigate();

  const handleNewUpload = (newDoc: DocumentEntity) => {
    setRecentDocs(prev => [newDoc, ...prev]);
  };

  return (
    <div className="space-y-6 relative">
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={handleNewUpload} 
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Operations Overview</h2>
          <p className="text-slate-500 mt-1">Real-time insight into Tripleswitch business performance.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/reports')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            Go to Reports
          </button>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
          >
            Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_METRICS.map((metric, i) => (
          <MetricCard key={i} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">Document Processing Activity</h3>
            <select className="text-sm border-gray-200 rounded-md text-gray-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="docs" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDocs)" />
                <Area type="monotone" dataKey="forms" stroke="#f59e0b" strokeWidth={3} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">Compliance Trend</h3>
          </div>
          <div className="h-40 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceData}>
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                <XAxis dataKey="name" hide />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center text-red-700">
                <AlertTriangle size={18} className="mr-2" />
                <span className="text-sm font-medium">Restricted Access Attempt</span>
              </div>
              <span className="text-xs text-red-500">2h ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-700">
                <FileCheck size={18} className="mr-2" />
                <span className="text-sm font-medium">TTB Report Approved</span>
              </div>
              <span className="text-xs text-blue-500">5h ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Recent Documents</h3>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Classification</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
                        <FileText size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ClassificationBadge level={doc.classification} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.uploadedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;