import React, { useState } from 'react';
import { X, Table2, HelpCircle } from 'lucide-react';
import { AppLanguage } from '../types';

interface ParallelsGuideProps {
  language: AppLanguage;
}


export const ParallelsGuide: React.FC<ParallelsGuideProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);

  const title = language === AppLanguage.ENGLISH 
    ? "Universal Types of Parallels in Scripture" 
    : "Таблица универсальных видов параллелей в Писании";

  const headers = language === AppLanguage.ENGLISH
    ? ["No", "Type of Parallel", "Meaning", "What it looks like", "Applicable Books"]
    : ["№", "Тип параллели", "Что это значит", "Как выглядит", "Для какой книги подходит"];

  const russianData = [
    {
      id: 1,
      type: "Точное словесное повторение",
      meaning: "Один и тот же текст или почти дословный повтор внутри книги",
      looks_like: "Фраза либо абзац появляется дважды: в повествовании, песне или пророческой речи",
      books: "Исторические книги, Псалтирь, Пророки"
    },
    {
      id: 2,
      type: "Повторяющийся монолог / реплика",
      meaning: "Персонаж повторяет одну и ту же мысль, усиливая драму",
      looks_like: "Как Илия в 3 Цар. 19: «ревностно ревновал…»",
      books: "Исторические книги, Пророки"
    },
    {
      id: 3,
      type: "Параллельные сюжеты",
      meaning: "То же событие описано вторым автором или в другой редакции",
      looks_like: "Бой, реформа, чудо, царская хроника — в двух местах",
      books: "Самуил/Царств ↔ Паралипоменон"
    },
    {
      id: 4,
      type: "Дублированный закон / установление",
      meaning: "Один и тот же закон дан дважды или в расширенной версии",
      looks_like: "Десять Заповедей в 2 редакциях",
      books: "Исход ↔ Второзаконие"
    },
    {
      id: 5,
      type: "Поэтический параллелизм",
      meaning: "Фраза А и фраза Б говорят одно и то же идущими волнами",
      looks_like: "Вторая строка отражает, уточняет или усиливает первую",
      books: "Псалтирь, Притчи, Пророки"
    },
    {
      id: 6,
      type: "Темно-световые зеркала (контрастные параллели)",
      meaning: "Два отрывка построены одинаково, но противопоставлены",
      looks_like: "Праведник и нечестивый; два пути; два царя",
      books: "Псалтирь, Притчи, Царства"
    },
    {
      id: 7,
      type: "Образный дублет (одна идея — два символа)",
      meaning: "Одна мысль выражена двумя образами — зерно и закваска, овца и монета",
      looks_like: "Притчи Иисуса или пророческие метафоры",
      books: "Притчи, Пророки, Евангелия"
    },
    {
      id: 8,
      type: "Структурные рифмы",
      meaning: "Повествование «звучит» одинаковыми блоками: вступление → кризис → откровение → выход",
      looks_like: "Как повторяемые циклы Судей",
      books: "Исторические книги, Пророки"
    }
  ];

  const englishData = [
    {
      id: 1,
      type: "Exact Verbal Repetition",
      meaning: "The same text or nearly verbatim repetition within a book",
      looks_like: "A phrase or paragraph appears twice: in narrative, song, or prophetic speech",
      books: "Historical books, Psalms, Prophets"
    },
    {
      id: 2,
      type: "Recurring Monologue / Replica",
      meaning: "A character repeats the same thought, intensifying the drama",
      looks_like: "Like Elijah in 1 Kings 19: 'I have been very jealous...'",
      books: "Historical books, Prophets"
    },
    {
      id: 3,
      type: "Parallel Plots",
      meaning: "The same event described by a second author or in a different edition",
      looks_like: "Battle, reform, miracle, royal chronicle — in two places",
      books: "Samuel/Kings ↔ Chronicles"
    },
    {
      id: 4,
      type: "Duplicated Law / Ordinance",
      meaning: "The same law is given twice or in an expanded version",
      looks_like: "Ten Commandments in 2 versions",
      books: "Exodus ↔ Deuteronomy"
    },
    {
      id: 5,
      type: "Poetic Parallelism",
      meaning: "Phrase A and Phrase B say the same thing in waves",
      looks_like: "The second line reflects, clarifies, or intensifies the first",
      books: "Psalms, Proverbs, Prophets"
    },
    {
      id: 6,
      type: "Dark-Light Mirrors (Contrast Parallels)",
      meaning: "Two passages are constructed similarly but opposed",
      looks_like: "The righteous and the wicked; two ways; two kings",
      books: "Psalms, Proverbs, Kings"
    },
    {
      id: 7,
      type: "Figurative Doublet (One idea — two symbols)",
      meaning: "One thought expressed by two images — grain and leaven, sheep and coin",
      looks_like: "Parables of Jesus or prophetic metaphors",
      books: "Proverbs, Prophets, Gospels"
    },
    {
      id: 8,
      type: "Structural Rhymes",
      meaning: "Narrative 'sounds' in identical blocks: intro → crisis → revelation → exit",
      looks_like: "Like the repeating cycles of Judges",
      books: "Historical books, Prophets"
    }
  ];

  const data = language === AppLanguage.ENGLISH ? englishData : russianData;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors text-sm font-medium"
        title={language === AppLanguage.ENGLISH ? "View Parallels Guide" : "Открыть таблицу параллелей"}
      >
        <Table2 size={16} />
        <span className="hidden sm:inline">{language === AppLanguage.ENGLISH ? "Parallels Guide" : "Таблица параллелей"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <div className="flex items-center gap-2 text-indigo-900">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">{title}</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-0">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-stone-100 text-stone-700 font-serif sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 font-bold border-b border-stone-200 w-12 text-center">{headers[0]}</th>
                    <th className="p-4 font-bold border-b border-stone-200 w-48">{headers[1]}</th>
                    <th className="p-4 font-bold border-b border-stone-200">{headers[2]}</th>
                    <th className="p-4 font-bold border-b border-stone-200">{headers[3]}</th>
                    <th className="p-4 font-bold border-b border-stone-200 w-48">{headers[4]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.map((row) => (
                    <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="p-4 text-center font-bold text-indigo-900/50 bg-stone-50/50 group-hover:bg-indigo-50/50">{row.id}</td>
                      <td className="p-4 font-bold text-indigo-900 font-serif">{row.type}</td>
                      <td className="p-4 text-stone-700 leading-relaxed">{row.meaning}</td>
                      <td className="p-4 text-stone-600 italic bg-stone-50/30">{row.looks_like}</td>
                      <td className="p-4 text-stone-500 text-xs font-medium uppercase tracking-wide">{row.books}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-center text-stone-400">
               BiblioNexus Reference Tools
            </div>
          </div>
        </div>
      )}
    </>
  );
};