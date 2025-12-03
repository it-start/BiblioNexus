import React, { useState } from 'react';
import { Image, Loader2, Download, Maximize2, Quote } from 'lucide-react';
import { generateBiblicalImage } from '../services/geminiService';
import { ImageSize, Citation, AppLanguage } from '../types';

/**
 * Props for the ImageGenerator component.
 * @property citations - An optional array of citations to be used for quick selection.
 * @property language - The language to be used for the component's text.
 */
interface ImageGeneratorProps {
  citations?: Citation[];
  language?: AppLanguage;
}

/**
 * A component that allows users to generate biblical scenes as images.
 *
 * @param citations - An optional array of citations to be used for quick selection.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders the image generator.
 */
export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ citations = [], language = AppLanguage.ENGLISH }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [reference, setReference] = useState('');
  const [generatedReference, setGeneratedReference] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Визуализатор библейских сцен" : "Biblical Scene Visualizer",
    descLabel: language === AppLanguage.RUSSIAN ? "Описание сцены" : "Scene Description",
    descPlaceholder: language === AppLanguage.RUSSIAN ? "напр., Моисей разделяет море, Давид играет на арфе..." : "e.g., Moses parting the Red Sea, David playing the harp...",
    refLabel: language === AppLanguage.RUSSIAN ? "Ссылка на Писание" : "Scripture Reference",
    optional: language === AppLanguage.RUSSIAN ? "Необязательно" : "Optional",
    refPlaceholder: language === AppLanguage.RUSSIAN ? "напр., Бытие 1:1" : "e.g. Genesis 1:1",
    quickSelect: language === AppLanguage.RUSSIAN ? "▼ Быстрый выбор из цитат анализа" : "▼ Quick Select from Analysis Citations",
    resolution: language === AppLanguage.RUSSIAN ? "Разрешение" : "Resolution",
    generate: language === AppLanguage.RUSSIAN ? "Сгенерировать" : "Generate Visualization",
    visualizing: language === AppLanguage.RUSSIAN ? "Визуализация..." : "Visualizing...",
    error: language === AppLanguage.RUSSIAN ? "Не удалось создать изображение. Попробуйте другой запрос." : "Failed to generate image. Please try a different prompt or check permissions.",
    standard: language === AppLanguage.RUSSIAN ? "Стандарт (1K)" : "1K (Standard)",
    high: language === AppLanguage.RUSSIAN ? "Высокое (2K)" : "2K (High)",
    ultra: language === AppLanguage.RUSSIAN ? "Ультра (4K)" : "4K (Ultra)",
    generatedBy: language === AppLanguage.RUSSIAN ? "BiblioNexus ИИ" : "BiblioNexus AI"
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setImageUrl(null);
    
    try {
      const url = await generateBiblicalImage(prompt, size);
      setImageUrl(url);
      setGeneratedReference(reference);
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleCitationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReference(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-stone-200 mt-8">
      <div className="flex items-center gap-2 mb-6 text-indigo-900 border-b border-stone-100 pb-2">
        <Image className="w-6 h-6" />
        <h2 className="text-xl font-serif font-bold">{t.title}</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.descLabel}</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.descPlaceholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               {t.refLabel} <span className="text-gray-400 font-normal">({t.optional})</span>
             </label>
             <div className="flex flex-col gap-2">
               <div className="relative">
                 <Quote className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                 <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder={t.refPlaceholder}
                  className="w-full pl-9 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
               </div>
               
               {citations && citations.length > 0 && (
                 <select
                   onChange={handleCitationSelect}
                   value=""
                   className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded text-stone-600 focus:outline-none hover:bg-stone-100 transition-colors"
                 >
                   <option value="" disabled>{t.quickSelect}</option>
                   {citations.map((c, idx) => (
                     <option key={idx} value={`${c.book} ${c.chapter}:${c.verse_start}${c.verse_end ? '-' + c.verse_end : ''}`}>
                       {c.book} {c.chapter}:{c.verse_start} — {c.text.substring(0, 40)}...
                     </option>
                   ))}
                 </select>
               )}
             </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.resolution}</label>
            <select 
              value={size}
              onChange={(e) => setSize(e.target.value as ImageSize)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="1K">{t.standard}</option>
              <option value="2K">{t.high}</option>
              <option value="4K">{t.ultra}</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Maximize2 size={18} />}
        {loading ? t.visualizing : t.generate}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="mt-8 animate-fade-in">
          <div className="bg-white p-3 rounded-xl shadow-lg border border-stone-200 inline-block w-full">
            <div className="relative group rounded-lg overflow-hidden border border-stone-100">
              <img src={imageUrl} alt="Generated Scene" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
              <a 
                href={imageUrl} 
                download={`biblionexus-${Date.now()}.png`}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white text-gray-700 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-auto"
                title="Download Image"
              >
                <Download size={20} />
              </a>
            </div>
            
            {(generatedReference || prompt) && (
              <div className="mt-4 text-center px-4 pb-2">
                {generatedReference && (
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">{generatedReference}</h3>
                )}
                <p className="text-sm text-gray-500 italic font-serif">"{prompt}"</p>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-gray-400">
               <span>Gemini 3 Pro • {size}</span>
               <span>{t.generatedBy}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
