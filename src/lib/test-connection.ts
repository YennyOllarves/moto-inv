import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...')
    
    // Test basic connection
    const { data, error } = await supabase.from('repuestos').select('count').single()
    
    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Conexión exitosa a Supabase')
    console.log('📊 Total de repuestos:', data?.count || 0)
    
    return { success: true, count: data?.count || 0 }
  } catch (err) {
    console.error('❌ Error inesperado:', err)
    return { success: false, error: 'Error inesperado' }
  }
}

// Test para crear un repuesto de ejemplo
export async function testCreateSample() {
  try {
    console.log('🔍 Probando crear repuesto de ejemplo...')
    
    const sampleData = {
      name: 'Filtro de Aceite Prueba',
      sku: 'TEST-001',
      motorcycle_brand: 'Honda',
      category: 'Motor',
      stock: 10,
      price: 150.50
    }
    
    const { data, error } = await supabase
      .from('repuestos')
      .insert([sampleData])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error al crear repuesto:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Repuesto creado exitosamente:', data)
    return { success: true, data }
  } catch (err) {
    console.error('❌ Error inesperado:', err)
    return { success: false, error: 'Error inesperado' }
  }
}
