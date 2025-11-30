import React, { useState } from 'react';
import { Search, Book, Menu, Globe } from 'lucide-react';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ChatBot } from './components/ChatBot';
import { ImageGenerator } from './components/ImageGenerator';
import { ParallelsGuide } from './components/ParallelsGuide';
import { analyzeBibleTopic } from './services/geminiService';
import { AnalysisData, AppLanguage } from './types';

function App() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<AppLanguage>(AppLanguage.ENGLISH);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    titleSuffix: language === AppLanguage.RUSSIAN ? "Исследуйте" : "Explore the",
    titleHighlight: language === AppLanguage.RUSSIAN ? "Живое Слово" : "Living Word",
    placeholder: language === AppLanguage.RUSSIAN ? "Введите тему, личность или стих (напр. 'Царь Давид', 'Искупление')..." : "Enter a topic, person, or verse (e.g., 'King David', 'Redemption')...",
    analyze: language === AppLanguage.RUSSIAN ? "Анализ" : "Analyze",
    features: language === AppLanguage.RUSSIAN 
      ? "Строгий богословский анализ • Проверенные цитаты • Визуальные карты • Генерация сцен" 
      : "Strict theological analysis • Verified citations • Visual mapping • Scene generation",
    errorTitle: language === AppLanguage.RUSSIAN ? "Ошибка анализа" : "Analysis Error",
    errorMessage: language === AppLanguage.RUSSIAN ? "Не удалось проанализировать эту тему. Пожалуйста, убедитесь, что она связана с Библией, и повторите попытку." : "Unable to analyze this topic. Please ensure it is related to the Bible and try again."
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null); // Clear previous results to show loading state cleanly

    try {
      const result = await analyzeBibleTopic(query, language);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === AppLanguage.ENGLISH ? AppLanguage.RUSSIAN : AppLanguage.ENGLISH);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9]">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-900 text-amber-500 p-2 rounded-lg">
              <Book size={24} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight hidden sm:block">
              Biblio<span className="text-indigo-700">Nexus</span>
            </h1>
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight sm:hidden">
              B<span className="text-indigo-700">N</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <ParallelsGuide language={language} />
            
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-sm font-medium text-stone-600"
            >
              <Globe size={16} />
              {language}
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className={`transition-all duration-500 ease-in-out ${data ? 'mb-10' : 'mb-32 mt-20 text-center'}`}>
          {!data && (
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
              {t.titleSuffix} <span className="text-indigo-700 italic">{t.titleHighlight}</span>
            </h2>
          )}
          
          <div className={`relative max-w-2xl ${!data ? 'mx-auto' : ''}`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.placeholder}
              className="w-full pl-6 pr-32 py-4 text-lg bg-white border-2 border-stone-200 rounded-full shadow-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-serif placeholder:font-sans placeholder:text-gray-400"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query}
              className="absolute right-2 top-2 bottom-2 bg-indigo-800 text-white px-8 rounded-full font-medium hover:bg-indigo-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Search size={18} />
                  <span>{t.analyze}</span>
                </>
              )}
            </button>
          </div>
          
          {!data && !loading && (
             <p className="mt-4 text-gray-500 text-sm">
               {t.features}
             </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto">
            <h3 className="text-red-800 font-bold mb-2">{t.errorTitle}</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="animate-fade-in-up">
            <AnalysisDashboard data={data} language={language} />
            <ImageGenerator citations={data.citations} language={language} />
          </div>
        )}
      </main>

      <ChatBot language={language} />
    </div>
  );
}

export default App;
