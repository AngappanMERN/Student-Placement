import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Search, Briefcase, MapPin, DollarSign } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', company: '', location: '', salary: '', description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/jobs/${editId}`, formData);
      } else {
        await api.post('/jobs', formData);
      }
      fetchJobs();
      setShowForm(false);
      setFormData({ title: '', company: '', location: '', salary: '', description: '' });
      setEditId(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving job');
    }
  };

  const editJob = (job) => {
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      description: job.description
    });
    setEditId(job._id);
    setShowForm(true);
  };

  const deleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Job Postings</h1>
          <p className="text-slate-500 mt-1">Create and manage opportunities for students.</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setFormData({ title: '', company: '', location: '', salary: '', description: '' });
              setEditId(null);
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Post New Job</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-slate-900 mb-6">{editId ? 'Edit Job Posting' : 'Create New Job'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Software Engineer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                <input required type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Google" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="San Francisco, CA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Salary Details</label>
                <input required type="text" name="salary" value={formData.salary} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="$120k - $150k" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="We are looking for..." />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all">{editId ? 'Update Job' : 'Publish Job'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
         <div className="grid md:grid-cols-2 gap-6">
           <div className="h-40 bg-white rounded-2xl border border-slate-100 animate-pulse" />
           <div className="h-40 bg-white rounded-2xl border border-slate-100 animate-pulse" />
         </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl shrink-0">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editJob(job)} className="p-1.5 text-slate-400 hover:text-primary bg-white rounded transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => deleteJob(job._id)} className="p-1.5 text-slate-400 hover:text-danger bg-white rounded transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
              <div className="flex items-center text-slate-500 text-sm mb-4">
                <Briefcase size={14} className="mr-1.5" /> {job.company}
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 mb-4">
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded"><MapPin size={12} className="text-slate-400"/> {job.location}</span>
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded"><DollarSign size={12} className="text-slate-400"/> {job.salary}</span>
              </div>
               <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
