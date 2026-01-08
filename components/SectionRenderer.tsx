
import React from 'react';
import { SectionContent } from '../types';

interface SectionRendererProps {
  section: SectionContent;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const isChapter = section.type === 'chapter';
  const isReferences = section.id === 'references';

  // Helper to detect if a line is a sub-header (e.g., "1.1 The Lie We Inherited")
  const isSubHeader = (text: string) => {
    return /^\d\.\d+/.test(text.trim());
  };

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-16">
        <span className="inline-block text-amber-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-4">
          {isChapter ? section.title : 'Front Matter'}
        </span>
        <h2 className={`text-4xl md:text-7xl font-black text-white leading-tight mb-6 ${!isChapter && 'italic'}`}>
          {isChapter ? section.subtitle?.replace(/^\d\.\d+/, '').trim() || section.title : section.title}
        </h2>
        {isChapter && (
           <div className="flex items-center gap-4 mt-8">
              <div className="h-px flex-1 bg-amber-500/20"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="h-px flex-1 bg-amber-500/20"></div>
           </div>
        )}
      </header>

      <div className="space-y-12">
        {section.content.map((para, i) => {
          if (isSubHeader(para)) {
            return (
              <h3 key={i} className="text-2xl md:text-3xl font-bold text-amber-500 mt-16 mb-6 tracking-tight">
                {para}
              </h3>
            );
          }

          if (isReferences) {
            return (
              <div key={i} className="pl-8 border-l border-amber-500/30">
                <p className="text-lg text-gray-400 font-light italic leading-relaxed">
                  {para}
                </p>
              </div>
            );
          }

          return (
            <div key={i} className="group relative">
              {i === 0 && isChapter ? (
                <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-amber-100/90 first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-amber-500">
                  {para}
                </p>
              ) : (
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light transition-colors duration-500 group-hover:text-gray-200">
                  {para}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {isChapter && (
        <div className="mt-24 p-12 glass rounded-[40px] border-amber-500/20 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <p className="text-amber-500/60 uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Core Philosophy</p>
          <p className="text-xl md:text-2xl font-bold text-white/90 italic">
            "Education means to bring out, to draw something forth... not to fit production needs of the master."
          </p>
        </div>
      )}
    </article>
  );
};

export default SectionRenderer;
