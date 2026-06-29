import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, Filter, CheckCircle, XCircle, User, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('All Jobs');
  const [filterStatus, setFilterStatus] = useState('All Status');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/applications/all');
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/applications/${id}`, { status });
      setApplications(applications.map(app => app._id === id ? data : app));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-rose-100 text-rose-700';
      case 'Shortlisted': return 'bg-amber-100 text-amber-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const uniqueJobs = ['All Jobs', ...new Set(applications.map(app => app.job?.title).filter(Boolean))];

  const filteredApps = applications.filter(app => {
    const matchSearch = app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJob = filterJob === 'All Jobs' || app.job?.title === filterJob;
    const matchStatus = filterStatus === 'All Status' || app.status === filterStatus;
    
    return matchSearch && matchJob && matchStatus;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Applicants</h1>
          <p className="text-slate-500 mt-1">Review and update student application statuses.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none w-36 md:w-40 bg-white"
            >
              {uniqueJobs.map(job => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none w-36 bg-white"
            >
              {['All Status', 'Applied', 'Shortlisted', 'Selected', 'Rejected'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 rounded-tl-2xl">Applicant Info</th>
                  <th className="px-6 py-4">Applied Role</th>
                  <th className="px-6 py-4">Academic Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-2xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app, index) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={app._id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {app.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{app.user?.name}</p>
                          <p className="text-xs text-slate-500">{app.user?.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                         {app.user?.skills?.slice(0, 3).map((skill, i) => (
                           <span key={i} className="inline-block px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">{skill}</span>
                         ))}
                         {app.user?.skills?.length > 3 && <span className="text-[10px] text-slate-400">+{app.user.skills.length - 3}</span>}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{app.job?.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Briefcase size={12} /> {app.job?.company}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 w-fit px-2 py-0.5 rounded">CGPA: {app.user?.cgpa || 'N/A'}</span>
                        <span className="text-xs text-slate-500">Class of {app.user?.passoutYear || 'N/A'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(app.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                        {app.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => updateStatus(app._id, 'Shortlisted')}
                          disabled={app.status === 'Shortlisted'}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded bg-white border border-slate-200 transition-colors disabled:opacity-50"
                          title="Shortlist"
                        >
                          <Filter size={16} />
                        </button>
                        <button 
                          onClick={() => updateStatus(app._id, 'Selected')}
                          disabled={app.status === 'Selected'}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded bg-white border border-slate-200 transition-colors disabled:opacity-50"
                          title="Accept"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => updateStatus(app._id, 'Rejected')}
                          disabled={app.status === 'Rejected'}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded bg-white border border-slate-200 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredApps.length === 0 && !loading && (
              <div className="p-12 text-center text-slate-500">
                No applicants found matching your criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
