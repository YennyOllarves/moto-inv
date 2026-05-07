// Script para verificar permisos de Supabase
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    transport: ws
  }
});

async function checkPermissions() {
  console.log('🔍 Verificando permisos de Supabase...');
  
  try {
    // 1. Verificar si podemos leer
    console.log('\n📖 Probando lectura...');
    const { data: readData, error: readError } = await supabase
      .from('repuestos')
      .select('count')
      .single();
    
    if (readError) {
      console.error('❌ Error de lectura:', readError);
    } else {
      console.log('✅ Lectura exitosa:', readData);
    }
    
    // 2. Verificar si podemos insertar
    console.log('\n➕ Probando inserción...');
    const testData = {
      name: 'TEST PERMISSIONS',
      sku: 'PERM-TEST',
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
      console.error('❌ Error de inserción:', insertError);
      console.error('Código:', insertError.code);
      console.error('Mensaje:', insertError.message);
      console.error('Detalles:', insertError.details);
      
      if (insertError.code === '42501') {
        console.error('\n🚨 PROBLEMA DETECTADO: No tienes permisos de inserción (RLS)');
        console.error('💡 SOLUCIÓN: Debes configurar las políticas RLS en Supabase');
        console.error('📋 Pasos:');
        console.error('1. Ve a Supabase Dashboard');
        console.error('2. Authentication → Policies');
        console.error('3. Crea una política para la tabla repuestos');
        console.error('4. Permite INSERT para usuarios anónimos');
      }
    } else {
      console.log('✅ Inserción exitosa:', insertData);
      
      // Limpiar
      await supabase.from('repuestos').delete().eq('id', insertData.id);
      console.log('🧹 Registro de prueba eliminado');
    }
    
    // 3. Verificar estructura de la tabla
    console.log('\n🏗️ Verificando estructura de la tabla...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('repuestos')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error al verificar estructura:', tableError);
    } else {
      console.log('✅ Estructura de tabla OK');
      if (tableInfo.length > 0) {
        console.log('📋 Columnas encontradas:', Object.keys(tableInfo[0]));
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkPermissions();
