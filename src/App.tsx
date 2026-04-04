import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Moon, 
  Sun, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  BarChart3,
  MessageSquare,
  RefreshCcw,
  Info,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { questions, calculateScores } from './constants';
import TrigunaChatbot from './components/TrigunaChatbot';
import { TrigunaLogo } from './components/TrigunaLogo';
import { cn } from './lib/utils';

export default function App() {
  const [step, setStep] = useState<'landing' | 'quiz' | 'results'>('landing');
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [stability, setStability] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  
  // What-if simulator state
  const [simScores, setSimScores] = useState({ sattva: 50, rajas: 50, tamas: 50 });
  const [simStability, setSimStability] = useState<any>(null);

  const [selectedGunaInfo, setSelectedGunaInfo] = useState<any>(null);
  const [activeInfoSection, setActiveInfoSection] = useState<'theory' | 'research' | 'guide' | null>(null);

  const infoSections = {
    theory: {
      title: "Triguna Theory",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>The concept of Triguna is central to Samkhya philosophy and Ayurveda. It describes the three fundamental 'strands' or qualities that weave the fabric of all existence, including the human mind.</p>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">1. Sattva (Balance)</h4>
            <p className="text-sm">Represents clarity, light, and harmony. It is the state of mind that is calm, focused, and compassionate.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">2. Rajas (Activity)</h4>
            <p className="text-sm">Represents energy, movement, and passion. While necessary for action, excessive Rajas leads to restlessness and anxiety.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800">3. Tamas (Inertia)</h4>
            <p className="text-sm">Represents darkness, stability, and resistance. In balance, it provides rest; in excess, it leads to lethargy and confusion.</p>
          </div>
        </div>
      )
    },
    research: {
      title: "Research & Methodology",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>TrigunaMind utilizes a hybrid approach combining traditional IKS wisdom with modern psychometric analysis and machine learning.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><span className="font-bold">Data Mapping:</span> Questions are derived from validated IKS texts (Bhagavad Gita, Samkhya Karika) and mapped to psychological constructs.</li>
            <li><span className="font-bold">ML Model:</span> Our algorithm analyzes the interplay between Gunas to predict emotional stability, recognizing that high Rajas + high Tamas often correlates with lower stability.</li>
            <li><span className="font-bold">Validation:</span> The scoring logic is normalized to provide a comparative index of mental clarity versus restlessness.</li>
          </ul>
        </div>
      )
    },
    guide: {
      title: "IKS Guide for Students",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>Managing your Gunas is the key to academic and personal success. Here are the core IKS pillars for students:</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <h4 className="font-bold text-indigo-700 text-sm">Aahara (Diet)</h4>
              <p className="text-xs">Eat fresh, Sattvic foods to maintain mental clarity. Avoid excessive caffeine or spicy foods that spike Rajas.</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <h4 className="font-bold text-emerald-700 text-sm">Vihara (Lifestyle)</h4>
              <p className="text-xs">Maintain a regular sleep cycle (Dinacharya). Early morning study sessions align with the Sattvic time of day.</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <h4 className="font-bold text-amber-700 text-sm">Vichara (Thought)</h4>
              <p className="text-xs">Practice mindfulness and self-reflection to identify when Rajas (stress) or Tamas (procrastination) is taking over.</p>
            </div>
          </div>
        </div>
      )
    }
  };

  const gunaDetails = {
    Sattva: {
      title: "Sattva (The Quality of Purity)",
      icon: <Sun className="text-emerald-500" size={40} />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      meaning: "Sattva is the quality of balance, harmony, goodness, purity, and holistic well-being. It is the force that leads to enlightenment and spiritual growth.",
      qualities: [
        "Clarity of thought and perception",
        "Inner peace and contentment (Santosha)",
        "Compassion and non-violence (Ahimsa)",
        "Truthfulness and wisdom",
        "Stability and fearlessness"
      ],
      importance: "High Sattva is essential for emotional stability, deep meditation, and clear decision-making. It allows a person to remain calm and focused even in challenging situations."
    },
    Rajas: {
      title: "Rajas (The Quality of Passion)",
      icon: <Activity className="text-amber-500" size={40} />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      meaning: "Rajas is the quality of energy, movement, passion, and change. It is the driving force behind ambition, desire, and worldly achievements.",
      qualities: [
        "High energy and dynamism",
        "Ambition and goal-orientation",
        "Restlessness and constant movement",
        "Strong desires and attachments",
        "Competitive spirit"
      ],
      importance: "Rajas is necessary for action and creativity. However, when excessive and unbalanced by Sattva, it leads to stress, anxiety, and emotional instability."
    },
    Tamas: {
      title: "Tamas (The Quality of Inertia)",
      icon: <Moon className="text-indigo-500" size={40} />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      meaning: "Tamas is the quality of darkness, inertia, inactivity, and materiality. It provides the necessary grounding and stability but can also lead to stagnation.",
      qualities: [
        "Lethargy and procrastination",
        "Confusion and lack of clarity",
        "Sleep and rest (in balance)",
        "Attachment to the material world",
        "Resistance to change"
      ],
      importance: "In balance, Tamas provides the stability needed for rest and sleep. In excess, it causes mental dullness, depression, and a lack of motivation."
    }
  };

  const handleAnswer = (val: number) => {
    const qId = questions[currentQuestionIdx].id;
    setResponses(prev => ({ ...prev, [qId]: val }));
    
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsPredicting(true);
    const scores = calculateScores(responses);
    setResults(scores);
    setSimScores(scores.overall);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scores.overall)
      });
      const data = await res.json();
      setStability(data);
      setSimStability(data);
      setStep('results');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  const updateSimulation = async (newScores: any) => {
    setSimScores(newScores);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScores)
      });
      const data = await res.json();
      setSimStability(data);
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = results ? [
    { name: 'Sattva', value: results.overall.sattva, color: '#10b981', desc: 'Clarity & Peace' },
    { name: 'Rajas', value: results.overall.rajas, color: '#f59e0b', desc: 'Activity & Passion' },
    { name: 'Tamas', value: results.overall.tamas, color: '#6366f1', desc: 'Inertia & Rest' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 120 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/50 border border-slate-100 cursor-pointer"
            >
              <TrigunaLogo className="w-11 h-11" />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700">TrigunaMind</h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <button onClick={() => setActiveInfoSection('theory')} className="hover:text-indigo-600 transition-colors cursor-pointer">Theory</button>
            <button onClick={() => setActiveInfoSection('research')} className="hover:text-indigo-600 transition-colors cursor-pointer">Research</button>
            <button onClick={() => setActiveInfoSection('guide')} className="hover:text-indigo-600 transition-colors cursor-pointer">IKS Guide</button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto text-center space-y-8"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ rotate: 360 }}
                  transition={{ 
                    duration: 2, 
                    ease: "linear", 
                    repeat: Infinity,
                    scale: { type: "spring", stiffness: 100 }
                  }}
                  className="flex justify-center"
                >
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-100 border border-slate-100 cursor-pointer">
                    <TrigunaLogo className="w-24 h-24" />
                  </div>
                </motion.div>
                <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-full">
                  IKS-Powered Psychology
                </span>
                <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                  Discover Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-500">Emotional DNA</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Using the ancient wisdom of Guna Theory and modern Machine Learning, 
                  TrigunaMind predicts your emotional stability and provides actionable insights 
                  for a balanced life.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                {[
                  { icon: <Sun className="text-emerald-500" />, title: "Sattva", desc: "Purity, clarity, and harmony." },
                  { icon: <Activity className="text-amber-500" />, title: "Rajas", desc: "Energy, action, and change." },
                  { icon: <Moon className="text-indigo-500" />, title: "Tamas", desc: "Inertia, darkness, and stability." }
                ].map((item, i) => (
                  <motion.button 
                    key={i} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGunaInfo(gunaDetails[item.title as keyof typeof gunaDetails])}
                    className="p-6 glass rounded-2xl text-left space-y-3 cursor-pointer group hover:border-indigo-300 transition-colors"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 flex items-center justify-between">
                      {item.title}
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Guna Detail Modal */}
              <AnimatePresence>
                {selectedGunaInfo && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedGunaInfo(null)}
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                      <div className={cn("p-8 md:p-10 space-y-6", selectedGunaInfo.bgColor)}>
                        <div className="flex justify-between items-start">
                          <div className="p-3 bg-white rounded-2xl shadow-sm">
                            {selectedGunaInfo.icon}
                          </div>
                          <button 
                            onClick={() => setSelectedGunaInfo(null)}
                            className="p-2 hover:bg-black/5 rounded-full transition-colors"
                          >
                            <ChevronLeft size={24} className="rotate-90 text-slate-400" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className={cn("text-3xl font-black", selectedGunaInfo.color)}>
                            {selectedGunaInfo.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed font-medium">
                            {selectedGunaInfo.meaning}
                          </p>
                        </div>
                      </div>

                      <div className="p-8 md:p-10 bg-white space-y-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Core Qualities</h4>
                          <ul className="grid grid-cols-1 gap-3">
                            {selectedGunaInfo.qualities.map((q: string, i: number) => (
                              <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                <div className={cn("w-1.5 h-1.5 rounded-full", selectedGunaInfo.color.replace('text', 'bg'))} />
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Why it matters</h4>
                          <p className="text-sm text-slate-600 leading-relaxed italic">
                            "{selectedGunaInfo.importance}"
                          </p>
                        </div>

                        <button 
                          onClick={() => setSelectedGunaInfo(null)}
                          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
                        >
                          Got it, thanks!
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Info Section Modals */}
              <AnimatePresence>
                {activeInfoSection && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setActiveInfoSection(null)}
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-xl font-bold text-slate-800">{infoSections[activeInfoSection].title}</h3>
                        <button 
                          onClick={() => setActiveInfoSection(null)}
                          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                          <ChevronLeft size={24} className="rotate-90 text-slate-400" />
                        </button>
                      </div>
                      <div className="p-8 max-h-[70vh] overflow-y-auto">
                        {infoSections[activeInfoSection].content}
                      </div>
                      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button 
                          onClick={() => setActiveInfoSection(null)}
                          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setStep('quiz')}
                className="group relative px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
              >
                Start Assessment
                <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-8 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>{questions[currentQuestionIdx].category} • Question {currentQuestionIdx + 1} of {questions.length}</span>
                  <span>{Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}% Complete</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="glass p-8 md:p-12 rounded-3xl space-y-12">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-snug">
                  {questions[currentQuestionIdx].text}
                </h3>

                <div className="grid grid-cols-5 gap-2 md:gap-4">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(val)}
                      className={cn(
                        "h-16 md:h-20 rounded-2xl font-bold text-lg transition-all border-2",
                        "hover:border-indigo-600 hover:bg-indigo-50",
                        responses[questions[currentQuestionIdx].id] === val 
                          ? "bg-indigo-600 text-white border-indigo-600" 
                          : "bg-white text-slate-400 border-slate-100"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button 
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-opacity"
                >
                  <ChevronLeft size={18} /> Previous
                </button>
              </div>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stability Score Card */}
                <div className="lg:col-span-2 glass p-8 rounded-3xl space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800">Emotional Stability Profile</h2>
                      <p className="text-slate-500">Based on your Guna distribution</p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} /> Analysis Complete
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="relative flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border-[12px] border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-indigo-600">{stability.score}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stability Index</span>
                      </div>
                      <svg className="absolute w-48 h-48 -rotate-90">
                        <circle
                          cx="96" cy="96" r="84"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="12"
                          strokeDasharray={527}
                          strokeDashoffset={527 - (527 * stability.score) / 100}
                          className="text-indigo-600 transition-all duration-1000 ease-out"
                        />
                      </svg>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Category</h4>
                        <p className={cn(
                          "text-2xl font-bold",
                          stability.category === 'Stable' ? "text-emerald-600" : 
                          stability.category === 'Moderate' ? "text-amber-600" : "text-rose-600"
                        )}>{stability.category}</p>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {stability.category === 'Stable' 
                          ? "Your high Sattva score indicates a strong foundation of inner peace and clarity. You handle stress with grace."
                          : stability.category === 'Moderate'
                          ? "You have a dynamic balance. While you are active and focused, occasional restlessness may affect your stability."
                          : "Your current profile suggests high Rajas or Tamas influence, which might lead to emotional volatility or inertia."}
                      </p>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Interpretation Panel */}
                <div className="space-y-6">
                  <div className="glass p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Info size={20} />
                      <h3 className="font-bold">Guna Insights</h3>
                    </div>
                    <div className="space-y-4">
                      {chartData.map((guna, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-700">{guna.name}</span>
                            <span className="text-slate-400 font-medium">{guna.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${guna.value}%`, backgroundColor: guna.color }} />
                          </div>
                          <p className="text-[10px] text-slate-500 italic">{guna.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="glass p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Sparkles size={20} />
                      <h3 className="font-bold">IKS Pillars (Guna Distribution)</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(results.categories).map(([cat, scores]: [string, any]) => {
                        const total = scores.sattva + scores.rajas + scores.tamas;
                        const sPerc = total > 0 ? Math.round((scores.sattva / total) * 100) : 0;
                        const rPerc = total > 0 ? Math.round((scores.rajas / total) * 100) : 0;
                        const tPerc = total > 0 ? Math.max(0, 100 - sPerc - rPerc) : 0;
                        
                        return (
                          <div key={cat} className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                            <div className="flex justify-between items-center">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cat}</p>
                              <div className="flex gap-3 text-[10px] font-bold">
                                <span className="text-emerald-600">S: {sPerc}%</span>
                                <span className="text-amber-600">R: {rPerc}%</span>
                                <span className="text-indigo-600">T: {tPerc}%</span>
                              </div>
                            </div>
                            <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-200 shadow-inner">
                              <div style={{ width: `${sPerc}%` }} className="bg-emerald-500 transition-all duration-1000" />
                              <div style={{ width: `${rPerc}%` }} className="bg-amber-500 transition-all duration-1000" />
                              <div style={{ width: `${tPerc}%` }} className="bg-indigo-500 transition-all duration-1000" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <TrigunaChatbot gunaScores={results} stabilityResult={stability} />
                </div>
              </div>

              {/* What-If Simulator */}
              <div className="glass p-8 rounded-3xl space-y-8">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="text-indigo-600" size={24} />
                  <h3 className="text-2xl font-bold text-slate-800">What-If Simulation</h3>
                </div>
                <p className="text-sm text-slate-500">Adjust the Guna values to see how your emotional stability would change.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-8">
                    {['sattva', 'rajas', 'tamas'].map((g) => (
                      <div key={g} className="space-y-3">
                        <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-slate-600">
                          <span>{g}</span>
                          <span>{simScores[g as keyof typeof simScores]}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0" max="100"
                          value={simScores[g as keyof typeof simScores]}
                          onChange={(e) => updateSimulation({ ...simScores, [g]: parseInt(e.target.value) })}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="md:col-span-2 flex items-center justify-center bg-slate-50/50 rounded-2xl p-8 border border-dashed border-slate-200">
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-black text-indigo-600">
                        {simStability?.score ?? stability.score}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Simulated Stability</p>
                        <p className={cn(
                          "text-lg font-bold",
                          (simStability?.category ?? stability.category) === 'Stable' ? "text-emerald-600" : 
                          (simStability?.category ?? stability.category) === 'Moderate' ? "text-amber-600" : "text-rose-600"
                        )}>{simStability?.category ?? stability.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => {
                    setStep('landing');
                    setResponses({});
                    setCurrentQuestionIdx(0);
                  }}
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors"
                >
                  <RefreshCcw size={18} /> Retake Assessment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-24 border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-sm text-slate-400 font-medium">© 2026 TrigunaMind IKS Research Lab. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-xs font-bold text-slate-300 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-500 transition-colors">Methodology</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
