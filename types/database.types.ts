export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          role: 'admin' | 'staff' | 'customer'
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          role?: 'admin' | 'staff' | 'customer'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          role?: 'admin' | 'staff' | 'customer'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          date: string
          location: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          location: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          location?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          email: string
          total_amount: number
          type: 'individual' | 'group'
          status: string
          qr_token: string
          used_at: string | null
          scanned_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          email: string
          total_amount: number
          type: 'individual' | 'group'
          status?: string
          qr_token?: string
          used_at?: string | null
          scanned_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          email?: string
          total_amount?: number
          type?: 'individual' | 'group'
          status?: string
          qr_token?: string
          used_at?: string | null
          scanned_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          type: 'child' | 'adult'
          holder_name: string
          holder_age: number | null
          parent_name: string | null
          holder_phone: string | null
          holder_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          type: 'child' | 'adult'
          holder_name: string
          holder_age?: number | null
          parent_name?: string | null
          holder_phone?: string | null
          holder_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          type?: 'child' | 'adult'
          holder_name?: string
          holder_age?: number | null
          parent_name?: string | null
          holder_phone?: string | null
          holder_address?: string | null
          created_at?: string
        }
      }
    }
  }
}
