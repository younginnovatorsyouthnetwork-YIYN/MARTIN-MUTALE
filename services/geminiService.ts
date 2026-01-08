
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export const checkApiKeySelected = async (): Promise<boolean> => {
  if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const openApiKeySelector = async (): Promise<void> => {
  if (typeof window.aistudio?.openSelectKey === 'function') {
    await window.aistudio.openSelectKey();
  }
};

export const generateVideoWithVeo = async (
  prompt: string,
  aspectRatio: AspectRatio,
  onStatusUpdate: (status: string) => void
): Promise<string> => {
  // GUIDELINE: Create a new GoogleGenAI instance right before making an API call 
  // to ensure it always uses the most up-to-date API key from the dialog.
  
  onStatusUpdate("Initializing generation request...");
  
  let operation;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });
  } catch (error: any) {
    // GUIDELINE: If the request fails with an error message containing "Requested entity was not found.", 
    // reset the key selection state and prompt the user to select a key again.
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_EXPIRED");
    }
    throw error;
  }

  onStatusUpdate("polling");

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    try {
      // Re-create instance for polling calls as well
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        throw new Error("API_KEY_EXPIRED");
      }
      throw error;
    }
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("No video URI returned in the response.");
  }

  // GUIDELINE: Append API key when fetching from download link
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
     throw new Error(`Failed to download video: ${response.statusText}`);
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
