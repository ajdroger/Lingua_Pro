import React, { useState, useEffect } from 'react';
import { Exercise, ExerciseType, Lesson, Language } from '../types';
import { generateLessonExercises, explainMistake } from '../services/geminiService';
import { Button } from './Button';
import { X, ArrowLeft, Zap, Info, CheckCircle, AlertCircle } from 'lucide-react';

interface LessonRunnerProps {
  lesson: Lesson;
  targetLanguage: Language;
  baseLanguage: Language;
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const LessonRunner: React.FC<LessonRunnerProps> = ({ 
  lesson, 
  targetLanguage, 
  baseLanguage,
  onComplete, 
  onExit 
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const generated = await generateLessonExercises(
        lesson.topic, 
        lesson.difficulty, 
        targetLanguage, 
        baseLanguage
      );
      setExercises(generated);
      setLoading(false);
    };
    loadContent();
  }, [lesson, targetLanguage, baseLanguage]);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0;

  const handleCheck = async () => {
    if (!currentExercise) return;

    let isCorrect = false;
    const userAnswer = currentExercise.type === ExerciseType.MULTIPLE_CHOICE 
      ? selectedOption 
      : textInput.trim();

    if (!userAnswer) return;

    if (currentExercise.type === ExerciseType.MULTIPLE_CHOICE) {
      isCorrect = userAnswer === currentExercise.correctAnswer;
    } else {
      isCorrect = userAnswer?.toLowerCase() === currentExercise.correctAnswer.toLowerCase();
    }

    setStatus(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(s => s + 10);
    } else {
      setAiThinking(true);
      const expl = await explainMistake(
        currentExercise.question, 
        userAnswer, 
        currentExercise.correctAnswer, 
        targetLanguage,
        baseLanguage
      );
      setExplanation(expl);
      setAiThinking(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStatus('idle');
      setSelectedOption(null);
      setTextInput("");
      setExplanation(null);
    } else {
      onComplete(score);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="flex items-center gap-4 mb-8">
           <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>{baseLanguage.flag}</div>
           <div className="w-2 h-2 bg-indigo-300 rounded-full animate-ping"></div>
           <div className="w-2 h-2 bg-indigo-300 rounded-full animate-ping delay-75"></div>
           <div className="w-2 h-2 bg-indigo-300 rounded-full animate-ping delay-150"></div>
           <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>{targetLanguage.flag}</div>
        </div>
        <p className="text-slate-600 font-medium animate-pulse text-lg">
          Designing your {targetLanguage.name} lesson...
        </p>
        <p className="text-slate-400 text-sm mt-2">Adapted for {baseLanguage.name} speakers</p>
      </div>
    );
  }

  if (!currentExercise) return <div>Error loading exercises</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-3xl mx-auto shadow-xl shadow-slate-200/50 my-0 md:my-4 md:rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6 flex items-center gap-4 border-b border-slate-100">
        <button onClick={onExit} className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
          {currentExercise.question}
        </h2>

        <div className="flex-1">
          {currentExercise.type === ExerciseType.MULTIPLE_CHOICE && (
            <div className="grid grid-cols-1 gap-3">
              {currentExercise.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => status === 'idle' && setSelectedOption(option)}
                  disabled={status !== 'idle'}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between
                    ${selectedOption === option 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'}
                    ${status !== 'idle' && option === currentExercise.correctAnswer ? 'border-emerald-500 bg-emerald-50 !text-emerald-700' : ''}
                    ${status === 'incorrect' && selectedOption === option ? 'border-rose-500 bg-rose-50 !text-rose-700' : ''}
                  `}
                >
                  <span className="font-medium">{option}</span>
                  {selectedOption === option && <div className="w-3 h-3 bg-indigo-500 rounded-full" />}
                </button>
              ))}
            </div>
          )}

          {(currentExercise.type === ExerciseType.TRANSLATE || currentExercise.type === ExerciseType.FILL_BLANK) && (
            <div>
               <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={status !== 'idle'}
                placeholder={`Type your answer in ${targetLanguage.name}...`}
                className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none resize-none min-h-[120px] bg-slate-50"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer / Feedback */}
      <div className={`p-6 border-t ${
        status === 'correct' ? 'bg-emerald-50 border-emerald-100' : 
        status === 'incorrect' ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'
      }`}>
        {status === 'idle' ? (
          <Button 
            fullWidth 
            size="lg" 
            onClick={handleCheck}
            disabled={currentExercise.type === ExerciseType.MULTIPLE_CHOICE ? !selectedOption : !textInput}
          >
            Check Answer
          </Button>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              {status === 'correct' ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <X size={20} />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${status === 'correct' ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {status === 'correct' ? 'Excellent!' : 'Not quite right'}
                </h3>
                
                {status === 'incorrect' && (
                  <div className="mt-2 text-rose-800">
                    <p className="font-medium">Correct answer:</p>
                    <p className="text-lg mb-2">{currentExercise.correctAnswer}</p>
                    
                    {aiThinking ? (
                       <div className="mt-3 flex items-center gap-2 text-sm text-rose-600 animate-pulse">
                         <Zap size={14} /> AI Tutor is analyzing your mistake...
                       </div>
                    ) : explanation ? (
                       <div className="mt-3 bg-white/50 p-3 rounded-lg border border-rose-200 text-sm text-slate-700">
                         <div className="flex items-center gap-1 font-semibold text-indigo-600 mb-1">
                           <Zap size={14} /> AI Explanation ({baseLanguage.name})
                         </div>
                         {explanation}
                       </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              variant={status === 'correct' ? 'secondary' : 'danger'} 
              fullWidth 
              size="lg" 
              onClick={handleNext}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};