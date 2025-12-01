import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Determine the API keys from various possible environment variable names
  const googleApiKey = env.GEMINI_API_KEY || env.API_KEY || env.GOOGLE_API_KEY;
  const mistralApiKey = env.MISTRAL_API_KEY;
  const mistralAgentId = env.MISTRAL_AGENT_ID;

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the existing code that relies on it.
      // We map the found 'googleApiKey' to 'process.env.API_KEY' so the service code works as is.
      'process.env.API_KEY': JSON.stringify(googleApiKey),
      'process.env.MISTRAL_API_KEY': JSON.stringify(mistralApiKey),
      'process.env.MISTRAL_AGENT_ID': JSON.stringify(mistralAgentId),
    },
  };
});