import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await register(formData);
      if (user?.role === 'admin') {
        navigate('/admin/analytics');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl min-h-[500px] relative rounded-lg border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] bg-[#13131a] overflow-hidden flex flex-col md:flex-row shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]">
        
        {/* Right Gradient Section - Absolute setup for the diagonal look */}
        <div 
          className="hidden md:flex absolute top-0 right-0 bottom-0 w-[50%] pointer-events-none z-0"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
            clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)'
          }}
        ></div>
        
        {/* Left Side: Form */}
        <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center z-10">
          <h2 className="text-3xl font-bold text-white mb-8">Register</h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative border-b-2 border-slate-600 focus-within:border-purple-500 transition-colors pb-2 flex items-center">
              <div className="flex-1">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full bg-transparent border-0 outline-none hover:outline-none focus:outline-none focus:ring-0 text-white placeholder:text-white/80 text-sm font-medium px-0"
                  style={{ boxShadow: 'none' }}
                />
              </div>
              <User size={18} className="text-white ml-2 shrink-0" />
            </div>

            <div className="relative border-b-2 border-slate-600 focus-within:border-purple-500 transition-colors pb-2 flex items-center">
              <div className="flex-1">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full bg-transparent border-0 outline-none hover:outline-none focus:outline-none focus:ring-0 text-white placeholder:text-white/80 text-sm font-medium px-0"
                  style={{ boxShadow: 'none' }}
                />
              </div>
              <Mail size={18} className="text-white ml-2 shrink-0" />
            </div>

            <div className="relative border-b-2 border-slate-600 focus-within:border-purple-500 transition-colors pb-2 flex items-center">
              <div className="flex-1">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-transparent border-0 outline-none hover:outline-none focus:outline-none focus:ring-0 text-white placeholder:text-white/80 text-sm font-medium px-0"
                  style={{ boxShadow: 'none' }}
                />
              </div>
              <Lock size={18} className="text-white ml-2 shrink-0" />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-white/80 mb-3">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setFormData({...formData, role: 'student'})}
                  className={`cursor-pointer border py-2.5 rounded-full flex justify-center text-sm font-medium transition-all ${formData.role === 'student' ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]' : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'}`}
                >
                  Student
                </div>
                <div 
                  onClick={() => setFormData({...formData, role: 'admin'})}
                  className={`cursor-pointer border py-2.5 rounded-full flex justify-center text-sm font-medium transition-all ${formData.role === 'admin' ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]' : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'}`}
                >
                  Admin
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wait...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-400 font-medium tracking-wide">
            Already have an account? <Link to="/login" className="text-purple-500 hover:text-purple-400 transition-colors ml-1">Sign In</Link>
          </div>
        </div>

        {/* Right Side: Text overlay */}
        <div className="hidden md:flex flex-col items-end justify-center p-14 z-10 w-[45%] text-right ml-auto">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-wide uppercase">
            Join<br/>Today!
          </h2>
          <p className="text-sm text-purple-100/80 font-medium max-w-[220px]">
            Create a profile and connect with the best opportunities.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
