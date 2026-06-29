import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCircle, Shield, Award, GraduationCap, Upload, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '',
    passoutYear: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        cgpa: user.cgpa || '',
        passoutYear: user.passoutYear || '',
        skills: user.skills ? user.skills.join(', ') : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      await updateProfile({
        name: formData.name,
        cgpa: Number(formData.cgpa),
        passoutYear: Number(formData.passoutYear),
        skills: skillsArray
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateStrength = () => {
    let score = 25; // Base score for having an account
    if (formData.name) score += 15;
    if (formData.cgpa) score += 20;
    if (formData.passoutYear) score += 15;
    if (formData.skills && formData.skills.length > 3) score += 25;
    return score;
  };

  const strength = calculateStrength();
  const strengthColor = strength < 50 ? 'bg-rose-500' : strength < 80 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your complete profile to stand out to recruiters.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-3xl mx-auto mb-4 relative group cursor-pointer">
              {user?.name?.charAt(0).toUpperCase()}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={20} className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm mt-1 mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 capitalize">
              <Shield size={14} className="text-primary" /> {user?.role} Role
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Award size={18} className="text-primary" /> Profile Strength
            </h3>
            
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-slate-900">{strength}%</span>
              <span className="text-xs font-medium text-slate-500 mb-1">
                {strength === 100 ? 'All Set!' : 'Keep filling details'}
              </span>
            </div>
            
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${strengthColor}`}
              />
            </div>
          </div>
          
          <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2">
            <Upload size={18} /> Generate Resume PDF
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Personal Information</h3>
            </div>
            
            <div className="p-6">
              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
                  <CheckCircle size={18} /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap size={18} className="text-slate-400" /> Academic Details
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CGPA (Out of 10)</label>
                      <input
                        type="number"
                        step="0.01"
                        max="10"
                        name="cgpa"
                        value={formData.cgpa}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. 8.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Passout Year</label>
                      <input
                        type="number"
                        name="passoutYear"
                        value={formData.passoutYear}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. 2026"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Award size={18} className="text-slate-400" /> Skills & Expertise
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Technical Skills (Comma separated)</label>
                    <textarea
                      name="skills"
                      rows="3"
                      value={formData.skills}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                      placeholder="React, Node.js, MongoDB, Python, Java..."
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.skills.split(',').filter(s => s.trim() !== '').map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
