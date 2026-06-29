import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, MapPin, DollarSign, Building, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ExploreJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const [resJobs, resApps] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications')
      ]);
      setJobs(resJobs.data);
      setApplications(resApps.data.map(app => app.job._id || app.job));
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplyingId(jobId);
      await api.post('/applications', { jobId });
      setApplications([...applications, jobId]);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Jobs</h1>
          <p className="text-slate-500 mt-1">Discover your next career opportunity.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm"
            placeholder="Search role or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse h-56">
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No jobs found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => {
            const hasApplied = applications.includes(job._id);
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={job._id} 
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-300"></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl mb-4 shrink-0">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                  {hasApplied && (
                    <span className="flex items-center gap-1 text-xs font-medium bg-success/10 text-success px-2.5 py-1 rounded-full">
                      <CheckCircle size={14} /> Applied
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <Building size={14} className="mr-1.5" />
                    {job.company}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                      <MapPin size={12} className="text-slate-400" /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                      <DollarSign size={12} className="text-slate-400" /> {job.salary}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-2 mb-6">
                    {job.description}
                  </p>
                </div>

                <button
                  onClick={() => !hasApplied && handleApply(job._id)}
                  disabled={hasApplied || applyingId === job._id}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    hasApplied 
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200' 
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-transparent'
                  }`}
                >
                  {applyingId === job._id ? 'Applying...' : hasApplied ? 'Already Applied' : 'Apply Now'}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExploreJobs;
