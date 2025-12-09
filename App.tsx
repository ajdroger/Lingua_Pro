import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { LessonRunner } from './components/LessonRunner';
import { INITIAL_LESSONS, SUPPORTED_LANGUAGES } from './constants';
import { Lesson, UserState, Language } from './types';
import { Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'lesson' | 'summary'>('dashboard');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  
  // Default Target: English (Index 0)
  const [targetLanguage, setTargetLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]); 
  
  // Default Base: Italian (Index 4) - assuming user is Italian based on query
  const [baseLanguage, setBaseLanguage] = useState<Language>(SUPPORTED_LANGUAGES[4]);

  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  
  const [userState, setUserState] = useState<UserState>({
    xp: 0,
    streak: 1,
    completedLessonIds: []
  });
  const [lastScore, setLastScore] = useState(0);

  const handleStartLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setView('lesson');
  };

  const handleLanguageChange = (lang: Language) => {
    setTargetLanguage(lang);
    setLessons(INITIAL_LESSONS.map(l => ({ ...l, isCompleted: false })));
  };

  const handleBaseLanguageChange = (lang: Language) => {
    setBaseLanguage(lang);
    // No need to reset progress when changing base language, but maybe reload the UI context
  };

  const handleLessonComplete = (score: number) => {
    setLastScore(score);
    if (currentLesson) {
      const updatedLessons = lessons.map(l => 
        l.id === currentLesson.id ? { ...l, isCompleted: true } : l
      );
      setLessons(updatedLessons);
      
      setUserState(prev => ({
        ...prev,
        xp: prev.xp + score,
        completedLessonIds: [...prev.completedLessonIds, currentLesson.id]
      }));
    }
    setView('summary');
  };

  const handleExitLesson = () => {
    setCurrentLesson(null);
    setView('dashboard');
  };

  if (view === 'lesson' && currentLesson) {
    return (
      <LessonRunner 
        lesson={currentLesson} 
        targetLanguage={targetLanguage}
        baseLanguage={baseLanguage}
        onComplete={handleLessonComplete}
        onExit={handleExitLesson}
      />
    );
  }

  if (view === 'summary') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
           <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
             <Trophy size={48} />
           </div>
           <h2 className="text-3xl font-bold text-slate-800 mb-2">Lesson Complete!</h2>
           <p className="text-slate-500 mb-8">You are making great progress in your {targetLanguage.name} journey.</p>
           
           <div className="flex justify-center gap-8 mb-8">
             <div className="text-center">
               <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">XP Earned</div>
               <div className="text-3xl font-bold text-indigo-600">+{lastScore}</div>
             </div>
             <div className="text-center">
               <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Streak</div>
               <div className="text-3xl font-bold text-orange-500">{userState.streak}</div>
             </div>
           </div>

           <button 
             onClick={() => setView('dashboard')}
             className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1"
           >
             Return to Path
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Dashboard 
        lessons={lessons} 
        onStartLesson={handleStartLesson}
        userXP={userState.xp}
        currentLanguage={targetLanguage}
        baseLanguage={baseLanguage}
        onLanguageChange={handleLanguageChange}
        onBaseLanguageChange={handleBaseLanguageChange}
      />
    </div>
  );
};

export default App;