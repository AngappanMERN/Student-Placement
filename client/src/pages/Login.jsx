import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, ArrowRight, User, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user?.role === 'admin') {
        navigate('/admin/analytics');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
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
          <h2 className="text-3xl font-bold text-white mb-8">Login</h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative border-b-2 border-slate-600 focus-within:border-purple-500 transition-colors pb-2 flex items-center">
              <div className="flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-transparent border-0 outline-none hover:outline-none focus:outline-none focus:ring-0 text-white placeholder:text-white/80 text-sm font-medium px-0"
                  style={{ boxShadow: 'none' }}
                />
              </div>
              <User size={18} className="text-white ml-2 shrink-0" />
            </div>

            <div className="relative border-b-2 border-slate-600 focus-within:border-purple-500 transition-colors pb-2 flex items-center">
              <div className="flex-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border-0 outline-none hover:outline-none focus:outline-none focus:ring-0 text-white placeholder:text-white/80 text-sm font-medium px-0"
                  style={{ boxShadow: 'none' }}
                />
              </div>
              <Lock size={18} className="text-white ml-2 shrink-0" />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wait...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-sm text-slate-400 font-medium tracking-wide">
            Dont have an account? <Link to="/register" className="text-purple-500 hover:text-purple-400 transition-colors ml-1">Sign Up</Link>
          </div>
        </div>

        {/* Right Side: Text overlay */}
        <div className="hidden md:flex flex-col items-end justify-center p-14 z-10 w-[45%] text-right ml-auto">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-wide uppercase">
            Welcome<br/>Back!
          </h2>
          <p className="text-sm text-purple-100/80 font-medium max-w-[220px]">
            Lorem ipsum, dolor sit amet consectetur adipisicing.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
