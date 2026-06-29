import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Building, MapPin, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/applications');
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    'Applied': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock size={16} /> },
    'Shortlisted': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock size={16} /> },
    'Selected': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle size={16} /> },
    'Rejected': { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: <XCircle size={16} /> }
  };

  const getStepperStatus = (status) => {
    const steps = ['Applied', 'Shortlisted', 'Selected'];
    const currentIndex = steps.indexOf(status === 'Rejected' ? 'Shortlisted' : status);
    
    return steps.map((step, index) => {
      let state = 'waiting';
      if (status === 'Rejected') {
        if (index < currentIndex) state = 'completed';
        else if (index === currentIndex) state = 'rejected';
      } else {
        if (index < currentIndex) state = 'completed';
        else if (index === currentIndex) state = 'active';
      }
      return { label: step, state };
    });
  };

  return (
    <div className="max-w-4xl mx-auto border-transparent">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 mt-1">Track the status of your job applications.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
              <div className="h-2 bg-slate-100 rounded w-full mt-8"></div>
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No applications yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">You haven't applied to any jobs yet. Head over to explore jobs to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => {
            const job = app.job;
            const config = statusConfig[app.status] || statusConfig['Applied'];
            const steps = getStepperStatus(app.status);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={app._id} 
                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl shrink-0">
                      {job?.company?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {job?.title}
                      </h3>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Building size={16} className="mr-1.5" />
                        {job?.company}
                      </div>

                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="inline-flex items-center gap-1.5 text-slate-500 text-sm">
                          <MapPin size={14} /> {job?.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-slate-500 text-sm">
                          <Calendar size={14} /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-sm font-medium ${config.color} w-fit`}>
                    {config.icon}
                    {app.status}
                  </div>
                </div>

                {/* Progress Stepper UI */}
                <div className="mt-8 relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0 hidden sm:block"></div>
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2 bg-white sm:bg-transparent">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm transition-colors ${
                          step.state === 'completed' ? 'bg-primary border-primary text-white' :
                          step.state === 'active' ? 'bg-white border-primary text-primary' :
                          step.state === 'rejected' ? 'bg-rose-500 border-rose-500 text-white' :
                          'bg-white border-slate-200 text-slate-300'
                        }`}>
                          {step.state === 'completed' ? <CheckCircle size={16} /> : 
                           step.state === 'rejected' ? <XCircle size={16} /> : idx + 1}
                        </div>
                        <span className={`text-sm font-medium ${
                          step.state === 'waiting' ? 'text-slate-400' :
                          step.state === 'rejected' ? 'text-rose-600' : 'text-slate-700'
                        }`}>
                          {step.state === 'rejected' ? 'Rejected' : step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
