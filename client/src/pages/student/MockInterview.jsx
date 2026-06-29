import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlayCircle, MessageSquare, Terminal, Server, Database, BrainCircuit, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MockInterview = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { id: 'react', name: 'React.js', icon: <Terminal size={24} className="text-[#61dafb]" />, color: 'hover:border-[#61dafb] hover:bg-[#61dafb]/5', questions: ['Explain the Virtual DOM and how React uses it.', 'What are Hooks? Provide examples of useState and useEffect.', 'How does Context API differ from Redux?'] },
    { id: 'node', name: 'Node.js', icon: <Server size={24} className="text-[#339933]" />, color: 'hover:border-[#339933] hover:bg-[#339933]/5', questions: ['What is the event loop in Node.js?', 'Explain stream in Node.js concepts.', 'How do you handle errors in Express middleware?'] },
    { id: 'db', name: 'Database / MongoDB', icon: <Database size={24} className="text-[#47A248]" />, color: 'hover:border-[#47A248] hover:bg-[#47A248]/5', questions: ['What is the difference between SQL and NoSQL?', 'Explain aggregation pipelines in MongoDB.', 'What is ACID compliance?'] },
    { id: 'dsa', name: 'Data Structures', icon: <BrainCircuit size={24} className="text-purple-500" />, color: 'hover:border-purple-500 hover:bg-purple-500/5', questions: ['Explain the time complexity of QuickSort.', 'How would you reverse a linked list?', 'What is a Hash Table and how does it resolve collisions?'] },
  ];

  // Based on user skills, highlight recommended categories
  const userSkills = user?.skills?.map(s => s.toLowerCase()) || [];
  
  const startInterview = (category) => {
    setSelectedCategory(category);
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setInterviewStarted(true);
      setCurrentQuestionIndex(0);
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedCategory.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const endInterview = () => {
    setInterviewStarted(false);
    setSelectedCategory(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Mock Interview</h1>
          <p className="text-slate-500 mt-1">Practice with our AI interviewer to ace your real interviews.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!interviewStarted && !isGenerating ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Ready for your mock interview, {user?.name.split(' ')[0]}?</h2>
                <p className="text-primary-100 max-w-xl">
                  We'll generate 3 targeted questions based on the topic you select. Answer them out loud to practice your communication skills.
                </p>
              </div>
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            </div>

            <h3 className="font-semibold text-slate-900 mb-4 px-1">Select a Category</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {categories.map((cat, idx) => {
                const isRecommended = userSkills.some(skill => cat.name.toLowerCase().includes(skill) || (cat.id === 'react' && skill.includes('react')));
                return (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={cat.id}
                    onClick={() => startInterview(cat)}
                    className={`bg-white p-6 rounded-2xl border text-left flex items-start gap-4 transition-all group ${cat.color} border-slate-100 shadow-sm`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-lg">{cat.name}</h4>
                        {isRecommended && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-700">Recommended</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">Practice core concepts, architectural patterns, and problem-solving.</p>
                      
                      <div className="mt-4 flex items-center font-semibold text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
                        <PlayCircle size={16} className="mr-1.5" /> Start Interview
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : isGenerating ? (
          <motion.div 
            key="generating"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
              <RefreshCw size={32} className="animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Generating Questions...</h2>
            <p className="text-slate-500">Tailoring the interview for {selectedCategory.name} based on industry standards.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="interview"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  {selectedCategory.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{selectedCategory.name} Interview</h3>
                  <p className="text-xs text-slate-500 font-medium">Question {currentQuestionIndex + 1} of {selectedCategory.questions.length}</p>
                </div>
              </div>
              <button onClick={endInterview} className="text-sm text-slate-500 hover:text-danger font-medium transition-colors">
                End Session
              </button>
            </div>

            {/* Question Area */}
            <div className="p-8 md:p-12 text-center min-h-[300px] flex flex-col justify-center relative">
              <MessageSquare size={48} className="text-primary/20 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight max-w-2xl mx-auto">
                {selectedCategory.questions[currentQuestionIndex]}
              </h2>
              <div className="absolute bottom-8 left-0 w-full flex justify-center">
                <span className="animate-pulse flex items-center gap-2 text-sm font-medium text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div> Recording answers (Simulated)
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="border-t border-slate-100 p-6 flex items-center justify-between bg-white">
              <div className="flex gap-1 flex-1">
                {selectedCategory.questions.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors ${i <= currentQuestionIndex ? 'bg-primary' : 'bg-slate-100'}`} />
                ))}
              </div>
              
              <div className="flex gap-3 ml-8">
                {currentQuestionIndex < selectedCategory.questions.length - 1 ? (
                  <button onClick={nextQuestion} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm">
                    Next Question
                  </button>
                ) : (
                  <button onClick={endInterview} className="px-6 py-2.5 bg-success text-white font-semibold rounded-xl hover:bg-success/90 transition-all shadow-sm flex items-center gap-2">
                    <CheckCircle size={18} /> Finish Interview
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MockInterview;
