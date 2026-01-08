
import React, { useState, useEffect } from 'react';
import SectionRenderer from './components/SectionRenderer';
import VideoVisualizer from './components/VideoVisualizer';
import { FULL_BOOK } from './constants';
import { openApiKeySelector } from './services/geminiService';
import { SectionContent } from './types';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState(FULL_BOOK.sections[0].id);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeSection = FULL_BOOK.sections.find(s => s.id === activeSectionId) || FULL_BOOK.sections[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSidebarOpen(false);
  }, [activeSectionId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Mobile Navigation Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-6 left-6 z-[60] lg:hidden w-12 h-12 glass rounded-full flex items-center justify-center text-amber-500 border-amber-500/30"
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0d] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 h-full flex flex-col">
          <div className="mb-12">
            <h1 className="text-xl font-black tracking-tighter text-white mb-1">PARADIGM SHIFT</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">The Future of Learning</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 px-3">Front Matter</p>
            {FULL_BOOK.sections.filter(s => s.type === 'frontmatter').map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${
                  activeSectionId === section.id 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.title}
              </button>
            ))}

            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-8 mb-4 px-3">The Treatise</p>
            {FULL_BOOK.sections.filter(s => s.type === 'chapter').map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all flex flex-col ${
                  activeSectionId === section.id 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="font-bold">{section.title}</span>
                {section.subtitle && (
                  <span className="text-[10px] opacity-60 truncate">{section.subtitle.split(':')[1] || section.subtitle}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <button 
              onClick={() => setShowVisualizer(true)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-sparkles text-xs"></i>
              Open Visualizer
            </button>
            <div className="text-[10px] text-gray-600 text-center leading-relaxed">
              By {FULL_BOOK.author} <br/> {FULL_BOOK.volume}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <SectionRenderer section={activeSection} />
          
          <div className="mt-24 pt-12 border-t border-white/5 flex items-center justify-between">
            <button 
              disabled={FULL_BOOK.sections.findIndex(s => s.id === activeSectionId) === 0}
              onClick={() => {
                const idx = FULL_BOOK.sections.findIndex(s => s.id === activeSectionId);
                setActiveSectionId(FULL_BOOK.sections[idx-1].id);
              }}
              className="px-6 py-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-xs uppercase tracking-widest disabled:opacity-0"
            >
              Previous
            </button>
            <button 
              disabled={FULL_BOOK.sections.findIndex(s => s.id === activeSectionId) === FULL_BOOK.sections.length - 1}
              onClick={() => {
                const idx = FULL_BOOK.sections.findIndex(s => s.id === activeSectionId);
                setActiveSectionId(FULL_BOOK.sections[idx+1].id);
              }}
              className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-0"
            >
              Next Chapter
            </button>
          </div>
        </div>

        <footer className="py-20 text-center border-t border-white/5 text-gray-600 text-xs">
          <p>&copy; 2024 Paradigm Shift. Rethinking African Prosperity.</p>
        </footer>
      </main>

      {/* Modal Visualizer */}
      {showVisualizer && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-6xl relative">
            <button 
              onClick={() => setShowVisualizer(false)}
              className="absolute -top-12 right-0 lg:-right-12 text-white hover:text-amber-500 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <VideoVisualizer />
          </div>
        </div>
      )}

      {/* Floating Action Button for Key Management */}
      <div className="fixed bottom-8 right-8 z-[70] flex flex-col items-end gap-2">
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-black/80 text-white text-[10px] px-3 py-1 rounded-lg font-bold border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Billing Docs
        </a>
        <button 
          onClick={() => openApiKeySelector()}
          className="group relative flex items-center justify-center w-14 h-14 bg-[#111] border border-white/10 text-amber-500 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95"
          title="Manage API Key"
        >
          <i className="fas fa-key text-xl"></i>
          <span className="absolute right-full mr-4 bg-black/80 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
            Update Veo Key
          </span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
};

export default App;
