import { GoogleGenAI, Type } from "@google/genai";
import { Exercise, ExerciseType, Lesson, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for generating a list of exercises
const exercisesSchema = {
  type: Type.OBJECT,
  properties: {
    exercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: [ExerciseType.MULTIPLE_CHOICE, ExerciseType.TRANSLATE, ExerciseType.FILL_BLANK] },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["id", "type", "question", "correctAnswer", "explanation"],
      },
    },
  },
};

export const generateLessonExercises = async (
  topic: string, 
  difficulty: string, 
  targetLanguage: Language,
  baseLanguage: Language
): Promise<Exercise[]> => {
  try {
    const prompt = `Create a professional language learning lesson about "${topic}" for a ${difficulty} level student.
    
    Context:
    - The student speaks: ${baseLanguage.name} (Base Language)
    - The student is learning: ${targetLanguage.name} (Target Language)
    
    Generate 5 exercises.
    1. For MULTIPLE_CHOICE: 
       - Question should be in ${targetLanguage.name} or ${baseLanguage.name} depending on what tests comprehension best.
       - Provide 4 options in ${targetLanguage.name}.
    
    2. For TRANSLATE: 
       - Provide a sentence in ${baseLanguage.name}.
       - The student must translate it into ${targetLanguage.name}.
       - Ensure the sentence is relevant to the topic.
    
    3. For FILL_BLANK: 
       - Provide a sentence in ${targetLanguage.name} with a missing word (represented by ____).
       - The missing word should be key vocabulary.
    
    General Rules:
    - Ensure the tone is professional/business oriented.
    - The "explanation" field must be in ${baseLanguage.name} to help the student understand.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: exercisesSchema,
        temperature: 0.4,
      },
    });

    const data = JSON.parse(response.text || '{"exercises": []}');
    return data.exercises;
  } catch (error) {
    console.error("Failed to generate lesson:", error);
    // Fallback static data
    return [
      {
        id: "fallback-1",
        type: ExerciseType.MULTIPLE_CHOICE,
        question: `Select the formal greeting for a business email in ${targetLanguage.name}.`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "Service is temporarily unavailable."
      }
    ];
  }
};

export const explainMistake = async (
  question: string, 
  userAnswer: string, 
  correctAnswer: string, 
  targetLanguage: Language,
  baseLanguage: Language
): Promise<string> => {
  try {
    const prompt = `I am a student speaking ${baseLanguage.name} and learning ${targetLanguage.name}.
    
    Question: "${question}"
    My Answer: "${userAnswer}"
    Correct Answer: "${correctAnswer}"
    
    Briefly explain in ${baseLanguage.name} why my answer is wrong and the nuance of the correct answer. 
    Keep it under 50 words. Professional tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Explanation unavailable.";
  } catch (error) {
    console.error("Failed to explain mistake:", error);
    return "Could not retrieve AI explanation at this time.";
  }
};