'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    try {
      addLog('🔍 Iniciando prueba de conexión a Supabase...');
      
      // Test 1: Verificar variables de entorno
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      addLog(`📋 URL: ${supabaseUrl ? '✅ Configurada' : '❌ No configurada'}`);
      addLog(`🔑 Anon Key: ${supabaseAnonKey ? '✅ Configurada' : '❌ No configurada'}`);
      
      if (!supabaseUrl || !supabaseAnonKey) {
        addLog('❌ Variables de entorno faltantes');
        return;
      }
      
      // Test 2: Crear cliente
      const supabase = getSupabaseClient();
      addLog('✅ Cliente Supabase creado');
      
      // Test 3: Intentar leer datos
      addLog('📊 Intentando leer datos de la tabla repuestos...');
      const { data, error } = await supabase.from('repuestos').select('count').single();
      
      if (error) {
        addLog(`❌ Error al leer datos: ${error.message}`);
        addLog(`Código de error: ${error.code}`);
        addLog(`Detalles: ${JSON.stringify(error.details)}`);
      } else {
        addLog(`✅ Datos leídos correctamente: ${data?.count || 0} repuestos`);
      }
      
      // Test 4: Intentar insertar un registro de prueba
      addLog('➕ Intentando insertar registro de prueba...');
      const testData = {
        name: 'TEST DEBUG',
        sku: 'DEBUG-001',
        motorcycle_brand: 'Honda',
        category: 'Motor',
        stock: 1,
        price: 99.99
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('repuestos')
        .insert([testData])
        .select()
        .single();
      
      if (insertError) {
        addLog(`❌ Error al insertar: ${insertError.message}`);
        addLog(`Código de error: ${insertError.code}`);
        addLog(`Detalles: ${JSON.stringify(insertError.details)}`);
      } else {
        addLog(`✅ Registro insertado correctamente: ${JSON.stringify(insertData)}`);
        
        // Limpiar el registro de prueba
        await supabase.from('repuestos').delete().eq('id', insertData.id);
        addLog('🧹 Registro de prueba eliminado');
      }
      
      setTestResult({ success: !error && !insertError, data, insertData });
      
    } catch (error: any) {
      addLog(`❌ Error general: ${error.message}`);
      setTestResult({ success: false, error: error.message });
    }
  };

  const testInsertManual = async () => {
    try {
      addLog('🔧 Prueba manual de inserción...');
      
      const supabase = getSupabaseClient();
      const manualData = {
        name: 'PRUEBA MANUAL',
        sku: 'MANUAL-001',
        motorcycle_brand: 'Yamaha',
        category: 'Frenos',
        stock: 5,
        price: 150.00
      };
      
      const { data, error } = await supabase
        .from('repuestos')
        .insert([manualData])
        .select();
      
      if (error) {
        addLog(`❌ Error manual: ${JSON.stringify(error)}`);
      } else {
        addLog(`✅ Inserción manual exitosa: ${JSON.stringify(data)}`);
        
        // Eliminar registro de prueba
        if (data && data[0]) {
          await supabase.from('repuestos').delete().eq('id', data[0].id);
          addLog('🧹 Registro manual eliminado');
        }
      }
    } catch (error: any) {
      addLog(`❌ Error manual general: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-orange-500">🔧 Debug de Supabase</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testConnection}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            🧪 Probar Conexión Completa
          </button>
          
          <button
            onClick={testInsertManual}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium ml-4"
          >
            🔧 Probar Inserción Manual
          </button>
          
          <button
            onClick={() => setLogs([])}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium ml-4"
          >
            🗑️ Limpiar Logs
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">📋 Logs</h2>
          <div className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No hay logs. Haz clic en "Probar Conexión" para comenzar.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        {testResult && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">📊 Resultado</h2>
            <pre className="bg-black rounded p-4 overflow-x-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
