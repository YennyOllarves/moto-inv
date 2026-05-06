import { supabase } from './supabase'
import { MotoPart, CreatePartData, UpdatePartData } from '@/types'

export class PartsDatabase {
  static async getParts(): Promise<MotoPart[]> {
    try {
      const { data, error } = await supabase
        .from('repuestos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching parts:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching parts:', error)
      return []
    }
  }

  static async savePart(partData: CreatePartData): Promise<MotoPart | null> {
    try {
      const { data, error } = await supabase
        .from('repuestos')
        .insert([partData])
        .select()
        .single()

      if (error) {
        console.error('Error creating part:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating part:', error)
      return null
    }
  }

  static async updatePart(partData: UpdatePartData): Promise<MotoPart | null> {
    try {
      const { id, ...updateData } = partData
      
      const { data, error } = await supabase
        .from('repuestos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating part:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error updating part:', error)
      return null
    }
  }

  static async deletePart(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('repuestos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting part:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting part:', error)
      return false
    }
  }

  static async getPartById(id: string): Promise<MotoPart | null> {
    try {
      const { data, error } = await supabase
        .from('repuestos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching part:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching part:', error)
      return null
    }
  }

  static async searchParts(query: string): Promise<MotoPart[]> {
    try {
      const { data, error } = await supabase
        .from('repuestos')
        .select('*')
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%,motorcycle_brand.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching parts:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error searching parts:', error)
      return []
    }
  }

  static async getPartsByCategory(category: string): Promise<MotoPart[]> {
    try {
      const { data, error } = await supabase
        .from('repuestos')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching parts by category:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching parts by category:', error)
      return []
    }
  }

  static async getPartsByBrand(brand: string): Promise<MotoPart[]> {
    try {
      const { data, error } = await supabase
        .from('repuestos')
        .select('*')
        .eq('motorcycle_brand', brand)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching parts by brand:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching parts by brand:', error)
      return []
    }
  }
}
