
import React, { useState, useEffect, useRef } from 'react';
import { generateVideoWithVeo, checkApiKeySelected, openApiKeySelector } from '../services/geminiService';
import { AspectRatio, VideoGenerationState } from '../types';
import { VEO_LOADING_MESSAGES } from '../constants';

const VideoVisualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('A cinematic shot of a futuristic library in Africa, glowing with golden light and youthful scholars, photorealistic, 4k');
  const [ratio, setRatio] = useState<AspectRatio>('16:9');
  const [state, setState] = useState<VideoGenerationState>({ status: 'idle' });
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const loadingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.status === 'generating' || state.status === 'polling') {
      loadingTimerRef.current = window.setInterval(() => {
        setLoadingMessageIdx(prev => (prev + 1) % VEO_LOADING_MESSAGES.length);
      }, 4000);
    } else {
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    }
    return () => {
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    };
  }, [state.status]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      const hasKey = await checkApiKeySelected();
      if (!hasKey) {
        setState({ status: 'checking_key' });
        await openApiKeySelector();
        // GUIDELINE: Assume success after triggering openSelectKey
      }

      setState({ status: 'generating' });
      const videoUri = await generateVideoWithVeo(prompt, ratio, (msg) => {
        // Update state to 'polling' when signaled by the service
        if (msg === 'polling') {
          setState(prev => ({ ...prev, status: 'polling' }));
        }
        console.log(msg);
      });
      
      setState({ status: 'completed', videoUri });
    } catch (err: any) {
      if (err.message === "API_KEY_EXPIRED") {
        setState({ status: 'idle' });
        await openApiKeySelector();
      } else {
        setState({ 
          status: 'error', 
          errorMessage: err.message || "An unexpected error occurred during generation." 
        });
      }
    }
  };

  return (
    <section id="visualizer" className="py-24 px-6 bg-[#0e0e0e] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Paradigm <span className="gradient-text">Visualizer</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Use Veo 3.1 to generate cinematic visions of educational and economic transformation. 
            Translate the text of Chapter One into powerful moving imagery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass p-8 rounded-3xl space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Creative Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none"
                  placeholder="Describe your vision..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRatio('16:9')}
                    className={`py-3 px-6 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      ratio === '16:9' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <i className="fas fa-desktop"></i> 16:9 Landscape
                  </button>
                  <button
                    onClick={() => setRatio('9:16')}
                    className={`py-3 px-6 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      ratio === '9:16' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <i className="fas fa-mobile-alt"></i> 9:16 Portrait
                  </button>
                </div>
              </div>

              <button
                disabled={state.status === 'generating' || state.status === 'polling'}
                onClick={handleGenerate}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-3 group"
              >
                {state.status === 'generating' ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Initializing...
                  </>
                ) : state.status === 'polling' ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> Rendering...
                  </>
                ) : (
                  <>
                    Generate Cinematic Video
                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </>
                )}
              </button>
              
              <p className="text-xs text-center text-gray-500">
                Note: Generative video may take up to 3 minutes. <br/>
                Requires a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">paid API key</a> for Veo 3.1.
              </p>
            </div>

            {state.status === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 flex items-start gap-3">
                <i className="fas fa-exclamation-circle mt-1"></i>
                <p className="text-sm">{state.errorMessage}</p>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video bg-black rounded-3xl border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center">
              {state.status === 'idle' && (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-video text-amber-500 text-3xl"></i>
                  </div>
                  <p className="text-gray-500 italic">Your generated vision will appear here.</p>
                </div>
              )}

              {(state.status === 'generating' || state.status === 'polling') && (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-amber-500/20 rounded-full"></div>
                    <div className="absolute top-0 w-24 h-24 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-amber-500 font-bold text-xl animate-pulse">
                      {VEO_LOADING_MESSAGES[loadingMessageIdx]}
                    </p>
                    <p className="text-gray-500 text-sm mt-2 italic">
                      Sculpting neural networks into pixels...
                    </p>
                  </div>
                </div>
              )}

              {state.status === 'completed' && state.videoUri && (
                <video
                  src={state.videoUri}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              )}
              
              {state.status === 'completed' && state.videoUri && (
                <div className="absolute top-4 right-4">
                  <a 
                    href={state.videoUri} 
                    download="veo-paradigm-shift.mp4"
                    className="p-3 bg-black/50 hover:bg-amber-500 text-white hover:text-black rounded-full transition-all"
                  >
                    <i className="fas fa-download"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoVisualizer;
