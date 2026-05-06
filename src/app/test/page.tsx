'use client';

import { useState } from 'react';
import { testSupabaseConnection, testCreateSample } from '@/lib/test-connection';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    const result = await testSupabaseConnection();
    setResult(result);
    setLoading(false);
  };

  const testCreate = async () => {
    setLoading(true);
    const result = await testCreateSample();
    setResult(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Test de Conexión Supabase</h1>
        
        <div className="space-y-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 px-6 py-3 rounded-lg"
          >
            {loading ? 'Probando...' : '🔍 Probar Conexión'}
          </button>
          
          <button
            onClick={testCreate}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 px-6 py-3 rounded-lg ml-4"
          >
            {loading ? 'Creando...' : '📝 Crear Repuesto Prueba'}
          </button>
        </div>

        {result && (
          <div className={`mt-8 p-6 rounded-lg ${
            result.success ? 'bg-green-900' : 'bg-red-900'
          }`}>
            <h2 className="text-xl font-semibold mb-4">
              {result.success ? '✅ Éxito' : '❌ Error'}
            </h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📋 Variables de Entorno Actuales</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'No definida'}</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***Configurada***' : 'No definida'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
