import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Briefcase, FileText, CheckCircle, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    selected: 0,
    recentApps: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [resUsers, resJobs, resApps] = await Promise.all([
        api.get('/auth/users'),
        api.get('/jobs'),
        api.get('/applications/all')
      ]);

      const apps = resApps.data;
      const selectedApps = apps.filter(a => a.status === 'Selected').length;

      setStats({
        users: resUsers.data.length,
        jobs: resJobs.data.length,
        applications: apps.length,
        selected: selectedApps,
        recentApps: apps.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Students', value: stats.users, icon: <Users size={24} />, bg: 'bg-blue-500/10 text-blue-600', trend: '+12%', type: 'up' },
    { title: 'Active Jobs', value: stats.jobs, icon: <Briefcase size={24} />, bg: 'bg-amber-500/10 text-amber-600', trend: '+4%', type: 'up' },
    { title: 'Total Applications', value: stats.applications, icon: <FileText size={24} />, bg: 'bg-purple-500/10 text-purple-600', trend: '+28%', type: 'up' },
    { title: 'Candidates Selected', value: stats.selected, icon: <CheckCircle size={24} />, bg: 'bg-emerald-500/10 text-emerald-600', trend: '+8%', type: 'up' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Analytics</h1>
        <p className="text-slate-500 mt-1">Overview of the entire placement ecosystem.</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={card.title} 
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    {card.icon}
                  </div>
                  <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${card.type === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                    {card.type === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                    {card.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{card.value}</h3>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
                <button className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                  View All <ArrowUpRight size={16} />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="pb-3 border-b border-slate-100">Student</th>
                      <th className="pb-3 border-b border-slate-100">Role</th>
                      <th className="pb-3 border-b border-slate-100">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats.recentApps.map(app => (
                      <tr key={app._id} className="hover:bg-slate-50/50">
                        <td className="py-3">
                          <p className="font-bold text-slate-900">{app.user?.name}</p>
                          <p className="text-xs text-slate-500">{app.user?.email}</p>
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-slate-700">{app.job?.title}</p>
                          <p className="text-xs text-slate-500">{app.job?.company}</p>
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                             app.status === 'Selected' ? 'bg-emerald-100 text-emerald-700' :
                             app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                             app.status === 'Shortlisted' ? 'bg-amber-100 text-amber-700' :
                             'bg-blue-100 text-blue-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Platform Activity</h3>
               <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {/* Dummy timeline data */}
                  {[
                    { title: 'New User Registration', time: '10 mins ago', type: 'user' },
                    { title: 'Job Posted: SDE-1', time: '1 hour ago', type: 'job' },
                    { title: 'Candidate Shortlisted', time: '3 hours ago', type: 'select' }
                  ].map((item, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                         {item.type === 'user' ? <Users size={16} /> : item.type === 'job' ? <Briefcase size={16} /> : <CheckCircle size={16} />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                          <span className="text-xs text-slate-500 font-medium">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
