import React, { useState } from 'react';
import { Lesson, Language } from '../types';
import { Check, Lock, Play, Briefcase, TrendingUp, Globe, ChevronDown, ArrowRight } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants';

interface DashboardProps {
  lessons: Lesson[];
  onStartLesson: (lesson: Lesson) => void;
  userXP: number;
  currentLanguage: Language; // Target Language
  baseLanguage: Language;    // Native/Base Language
  onLanguageChange: (lang: Language) => void;
  onBaseLanguageChange: (lang: Language) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  lessons, 
  onStartLesson, 
  userXP, 
  currentLanguage, 
  baseLanguage,
  onLanguageChange,
  onBaseLanguageChange
}) => {
  const [openMenu, setOpenMenu] = useState<'target' | 'base' | null>(null);

  const LanguageSelector = ({ 
    selected, 
    onSelect, 
    type 
  }: { 
    selected: Language, 
    onSelect: (l: Language) => void, 
    type: 'target' | 'base' 
  }) => (
    <div className="relative">
      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">
        {type === 'base' ? 'I Speak' : 'I Learn'}
      </div>
      <button 
        onClick={() => setOpenMenu(openMenu === type ? null : type)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border border-slate-200 hover:border-indigo-300 hover:bg-white bg-white/50
          ${openMenu === type ? 'ring-2 ring-indigo-100 border-indigo-300' : ''}
        `}
      >
        <span className="text-xl">{selected.flag}</span>
        <span className="text-sm font-semibold text-slate-700 hidden sm:block">{selected.name}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {openMenu === type && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpenMenu(null)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-40 max-h-80 overflow-y-auto">
            <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
              Select {type === 'base' ? 'Source' : 'Target'} Language
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onSelect(lang);
                  setOpenMenu(null);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 text-sm font-medium transition-colors border-b border-slate-50 last:border-0
                  ${selected.code === lang.code 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }
                `}
              >
                <span className="text-lg">{lang.flag}</span>
                {lang.name}
                {selected.code === lang.code && <Check size={14} className="ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto w-full pb-20">
      {/* Header Stats */}
      <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 py-3 mb-8 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-4 sm:gap-0">
        <div className="flex items-center gap-2 self-start sm:self-center">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-md">L</div>
           <span className="font-bold text-slate-800 text-lg tracking-tight">LinguaPro</span>
        </div>
        
        <div className="flex gap-3 items-end self-end sm:self-center">
          {/* Base Language */}
          <LanguageSelector 
            selected={baseLanguage} 
            onSelect={onBaseLanguageChange} 
            type="base" 
          />
          
          <div className="pb-3 text-slate-300">
            <ArrowRight size={16} />
          </div>

          {/* Target Language */}
          <LanguageSelector 
            selected={currentLanguage} 
            onSelect={onLanguageChange} 
            type="target" 
          />

          <div className="ml-2 mb-1 flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm h-[38px]">
             <TrendingUp size={16} />
             <span className="font-bold text-sm">{userXP}</span>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Business {currentLanguage.name}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <Globe size={14} />
              <span>Learning from {baseLanguage.name}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-200 -z-0 rounded-full" />

          {lessons.map((lesson, index) => {
            const isLocked = index > 0 && !lessons[index - 1].isCompleted && !lesson.isCompleted;
            const isNext = !lesson.isCompleted && (index === 0 || lessons[index - 1].isCompleted);
            
            return (
              <div key={lesson.id} className="relative z-10 flex items-start gap-6 group">
                <button
                  onClick={() => !isLocked && onStartLesson(lesson)}
                  disabled={isLocked}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center border-b-4 transition-all duration-200 shadow-sm shrink-0
                    ${lesson.isCompleted 
                      ? 'bg-emerald-500 border-emerald-700 text-white' 
                      : isNext 
                        ? 'bg-indigo-600 border-indigo-800 text-white scale-110 shadow-indigo-200 shadow-lg' 
                        : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  {lesson.isCompleted ? <Check size={28} /> : isLocked ? <Lock size={24} /> : <Play size={28} fill="currentColor" />}
                </button>
                
                <div className={`flex-1 pt-2 transition-opacity ${isLocked ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800">{lesson.title}</h3>
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wide">
                        {lesson.difficulty}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-3">{lesson.description}</p>
                    
                    {!isLocked && (
                      <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
                        <Briefcase size={14} />
                        <span>Topic: {lesson.topic}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};