import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { SummaryLength, QuizType, QuizQuestion, AppContext, Flashcard } from './types'; // Assuming types are in a local file

// Access the API key from Vite's environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// MODIFICATION: Added 'export' so ChatView.tsx can use this helper function.
export const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedData,
    },
  };
};

const getSummary = async (context: AppContext, length: SummaryLength): Promise<string> => {
    if (!context) return "Please provide some content to summarize.";
    try {
        const prompt = `You are an expert summarizer. Based on the following content, provide ${length}. Focus on the key points and main ideas.`;

        let parts: Part[] = [ {text: prompt} ];
        if (context.type === 'text') {
            parts.push({text: `\n\nText: "${context.content}"`});
        } else {
            const filePart = await fileToGenerativePart(context.file);
            parts.push(filePart);
        }

        const result = await model.generateContent({ contents: [{ role: "user", parts }] });
        return result.response.text();
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Sorry, I couldn't generate a summary. Please try again.";
    }
};

const initChat = (context: AppContext) => {
    if (!context) return null;

    const systemInstruction = `You are an AI study assistant. Your knowledge is strictly limited to the document provided. Answer all subsequent user questions based only on that document. Do not use external knowledge.`;
    
    // The context will be sent with the first message instead of in the history
    const chat = model.startChat({
      systemInstruction: {
        role: "system",
        parts: [{text: systemInstruction}],
      },
    });
    return chat;
};

const generateQuiz = async (context: AppContext, type: QuizType, count: number): Promise<QuizQuestion[]> => {
    if (!context) return [];
    
    const prompt = `Based on the following content, generate a quiz with exactly ${count} ${type} questions.
    - For Multiple-Choice, provide 4 options.
    - For Fill-in-the-Blanks, use "_____" to indicate the blank.
    - For all types, provide the correct answer.
    Return the response as a valid JSON array of objects.`;

    let parts: Part[] = [{ text: prompt }];
    if (context.type === 'text') {
        parts.push({text: `\n\nText: "${context.content}"`});
    } else {
        const filePart = await fileToGenerativePart(context.file);
        parts.push(filePart);
    }

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const quizData = JSON.parse(result.response.text());
        // Ensure the 'type' field is added to each question object
        return quizData.map((q: any) => ({ ...q, type }));

    } catch (error) {
        console.error("Error generating quiz:", error);
        return [{ question: "Failed to generate quiz questions. The AI might be busy. Please try again later.", answer: "", type }];
    }
};

const generateFlashcards = async (context: AppContext, count: number): Promise<Flashcard[]> => {
    if (!context) return [];
    
    const prompt = `Based on the following content, generate exactly ${count} flashcards. Each flashcard should have a 'term' (a key concept or name) and a 'definition' (a concise explanation of the term). Return the response as a valid JSON array of objects.`;

    let parts: Part[] = [{ text: prompt }];
     if (context.type === 'text') {
        parts.push({text: `\n\nText: "${context.content}"`});
    } else {
        const filePart = await fileToGenerativePart(context.file);
        parts.push(filePart);
    }

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        return JSON.parse(result.response.text()) as Flashcard[];

    } catch (error) {
        console.error("Error generating flashcards:", error);
        return [{ term: "Error", definition: "Failed to generate flashcards. The AI might be busy. Please try again." }];
    }
};

// MODIFICATION: Added 'export' so ChatView.tsx can use the Part type.
export type { Part };

export const geminiService = {
    getSummary,
    initChat,
    generateQuiz,
    generateFlashcards,
};