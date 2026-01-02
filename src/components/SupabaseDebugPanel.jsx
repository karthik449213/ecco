import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const SupabaseDebugPanel = () => {
  const [config, setConfig] = useState({
    urlPresent: false,
    keyPresent: false,
    urlValid: false,
    keyLength: 0,
  });

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setConfig({
      urlPresent: !!url,
      keyPresent: !!key,
      urlValid: url ? url.startsWith('https://') && url.includes('supabase') : false,
      keyLength: key ? key.length : 0,
      urlPreview: url ? url.substring(0, 40) + '...' : 'NOT SET',
    });
  }, []);

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        alert('Connection Error: ' + error.message);
      } else {
        alert('✓ Supabase connection successful!\nSession: ' + (data.session ? 'Active' : 'None'));
      }
    } catch (err) {
      alert('Connection Failed: ' + err.message);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 max-w-sm border-2 border-gray-300 z-50">
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        🔍 Supabase Config Check
      </h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">URL Present:</span>
          <span className={config.urlPresent ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
            {config.urlPresent ? '✓ YES' : '✗ NO'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">URL Valid:</span>
          <span className={config.urlValid ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
            {config.urlValid ? '✓ YES' : '✗ NO'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Key Present:</span>
          <span className={config.keyPresent ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
            {config.keyPresent ? '✓ YES' : '✗ NO'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Key Length:</span>
          <span className={config.keyLength > 100 ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
            {config.keyLength} chars
          </span>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-gray-500 text-xs mb-1">URL Preview:</p>
          <p className="text-gray-800 text-xs font-mono break-all">{config.urlPreview}</p>
        </div>
      </div>

      <button
        onClick={testConnection}
        className="w-full mt-3 bg-primary-600 text-white text-xs font-semibold py-2 px-3 rounded hover:bg-primary-700 transition"
      >
        Test Connection
      </button>

      {(!config.urlPresent || !config.keyPresent) && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-800 font-semibold">⚠️ Missing Configuration</p>
          <p className="text-xs text-red-600 mt-1">
            Create a <code>.env</code> file in the root directory with:
          </p>
          <pre className="text-xs mt-2 p-2 bg-red-100 rounded overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here`}
          </pre>
        </div>
      )}
    </div>
  );
};
