import React, { useState } from 'react';
import { Image, Loader2, Download, Maximize2 } from 'lucide-react';
import { generateBiblicalImage } from '../services/geminiService';
import { ImageSize } from '../types';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setImageUrl(null);
    
    try {
      const url = await generateBiblicalImage(prompt, size);
      setImageUrl(url);
    } catch (err) {
      setError("Failed to generate image. Please try a different prompt or check permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-stone-200 mt-8">
      <div className="flex items-center gap-2 mb-6 text-indigo-900 border-b border-stone-100 pb-2">
        <Image className="w-6 h-6" />
        <h2 className="text-xl font-serif font-bold">Biblical Scene Visualizer</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Scene Description</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Moses parting the Red Sea, David playing the harp..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
          <select 
            value={size}
            onChange={(e) => setSize(e.target.value as ImageSize)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            <option value="1K">1K (Standard)</option>
            <option value="2K">2K (High)</option>
            <option value="4K">4K (Ultra)</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Maximize2 size={18} />}
        {loading ? 'Visualizing...' : 'Generate Visualization'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <div className="relative group rounded-lg overflow-hidden shadow-lg border border-stone-200">
            <img src={imageUrl} alt="Generated Scene" className="w-full h-auto object-cover" />
            <a 
              href={imageUrl} 
              download={`biblionexus-${Date.now()}.png`}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white text-gray-700 transition-opacity opacity-0 group-hover:opacity-100"
            >
              <Download size={20} />
            </a>
          </div>
          <p className="text-xs text-center text-gray-500 italic">
            Generated with Gemini 3 Pro (Image Preview) @ {size}
          </p>
        </div>
      )}
    </div>
  );
};