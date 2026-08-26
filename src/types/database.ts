// Kader — Supabase typed database schema (hand-mirrored from supabase/schema.sql).
// Regenerate against your live project with: supabase gen types typescript
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type DbStaffRole = 'bar' | 'door' | 'kitchen' | 'floor' | 'manager' | 'security' | 'cleanup'

interface DbTable<Row, Insert, Update> {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      events: DbTable<
        { id: string; title: string; slug: string; date: string; type: string | null; description: string | null; image_url: string | null; ra_link: string | null; status: string | null; created_at: string | null; updated_at: string | null },
        { id?: string; title: string; slug: string; date: string; type?: string | null; description?: string | null; image_url?: string | null; ra_link?: string | null; status?: string | null; created_at?: string | null; updated_at?: string | null },
        { title?: string; slug?: string; date?: string; type?: string | null; description?: string | null; image_url?: string | null; ra_link?: string | null; status?: string | null; created_at?: string | null; updated_at?: string | null }
      >
      menu_items: DbTable<
        { id: string; category: string; name: string; description: string | null; price: number; is_available: boolean | null; created_at: string | null },
        { id?: string; category: string; name: string; description?: string | null; price: number; is_available?: boolean | null; created_at?: string | null },
        { category?: string; name?: string; description?: string | null; price?: number; is_available?: boolean | null; created_at?: string | null }
      >
      guestlists: DbTable<
        { id: string; event_id: string | null; guest_name: string; category: string | null; status: string | null; promoter_id: string | null; created_at: string | null },
        { id?: string; event_id?: string | null; guest_name: string; category?: string | null; status?: string | null; promoter_id?: string | null; created_at?: string | null },
        { event_id?: string | null; guest_name?: string; category?: string | null; status?: string | null; promoter_id?: string | null; created_at?: string | null }
      >
      site_settings: DbTable<
        { key: string; value: Record<string, unknown>; updated_at: string | null },
        { key: string; value: Record<string, unknown>; updated_at?: string | null },
        { value?: Record<string, unknown>; updated_at?: string | null }
      >
      ra_events: DbTable<
        { ra_id: number; title: string; date: string; start_time: string | null; end_time: string | null; cost: number | null; flyer_url: string | null; ra_url: string | null; lineup: string | null; artists: unknown[] | null; genres: unknown[] | null; pretix_event_url: string | null; created_at: string | null; updated_at: string | null },
        { ra_id?: number; title: string; date: string; start_time?: string | null; end_time?: string | null; cost?: number | null; flyer_url?: string | null; ra_url?: string | null; lineup?: string | null; artists?: unknown[] | null; genres?: unknown[] | null; pretix_event_url?: string | null; created_at?: string | null; updated_at?: string | null },
        { title?: string; date?: string; start_time?: string | null; end_time?: string | null; cost?: number | null; flyer_url?: string | null; ra_url?: string | null; lineup?: string | null; artists?: unknown[] | null; genres?: unknown[] | null; pretix_event_url?: string | null; updated_at?: string | null }
      >
      inquiries: DbTable<
        { id: string; name: string; email: string; type: string | null; party_size: number | null; date: string | null; status: string | null; notes: string | null; created_at: string | null },
        { id?: string; name: string; email: string; type?: string | null; party_size?: number | null; date?: string | null; status?: string | null; notes?: string | null; created_at?: string | null },
        { name?: string; email?: string; type?: string | null; party_size?: number | null; date?: string | null; status?: string | null; notes?: string | null; created_at?: string | null }
      >
      pretix_orders: DbTable<
        { id: string; event_id: string | null; order_code: string; status: string | null; email: string | null; items: Json | null; total: number | null; paid_at: string | null; raw_payload: Json | null; created_at: string | null; updated_at: string | null },
        { id?: string; event_id?: string | null; order_code: string; status?: string | null; email?: string | null; items?: Json | null; total?: number | null; paid_at?: string | null; raw_payload?: Json | null; created_at?: string | null; updated_at?: string | null },
        { event_id?: string | null; order_code?: string; status?: string | null; email?: string | null; items?: Json | null; total?: number | null; paid_at?: string | null; raw_payload?: Json | null; created_at?: string | null; updated_at?: string | null }
      >
      pretix_tickets: DbTable<
        { id: string; order_id: string | null; event_id: string | null; position_id: string; name: string | null; checkin_status: string | null; checked_in_at: string | null; created_at: string | null },
        { id?: string; order_id?: string | null; event_id?: string | null; position_id: string; name?: string | null; checkin_status?: string | null; checked_in_at?: string | null; created_at?: string | null },
        { order_id?: string | null; event_id?: string | null; position_id?: string; name?: string | null; checkin_status?: string | null; checked_in_at?: string | null; created_at?: string | null }
      >
      internal_notes: DbTable<
        { id: string; event_id: string | null; note_text: string | null; author_id: string | null; created_at: string | null },
        { id?: string; event_id?: string | null; note_text?: string | null; author_id?: string | null; created_at?: string | null },
        { event_id?: string | null; note_text?: string | null; author_id?: string | null; created_at?: string | null }
      >
      users_roles: DbTable<
        { id: string; user_id: string; role: string },
        { id?: string; user_id: string; role: string },
        { role?: string }
      >
      shift_templates: DbTable<
        { id: string; name: string; description: string | null; day_of_week: number; start_time: string; end_time: string; role: DbStaffRole; required_count: number; location: string | null; is_active: boolean | null; created_at: string | null; updated_at: string | null },
        { id?: string; name: string; description?: string | null; day_of_week: number; start_time: string; end_time: string; role: DbStaffRole; required_count?: number; location?: string | null; is_active?: boolean | null; created_at?: string | null; updated_at?: string | null },
        { name?: string; description?: string | null; day_of_week?: number; start_time?: string; end_time?: string; role?: DbStaffRole; required_count?: number; location?: string | null; is_active?: boolean | null; updated_at?: string | null }
      >
      shifts: DbTable<
        { id: string; template_id: string | null; date: string; start_time: string; end_time: string; role: DbStaffRole; required_count: number; location: string | null; status: string | null; notes: string | null; created_at: string | null; updated_at: string | null },
        { id?: string; template_id?: string | null; date: string; start_time: string; end_time: string; role: DbStaffRole; required_count?: number; location?: string | null; status?: string | null; notes?: string | null; created_at?: string | null; updated_at?: string | null },
        { template_id?: string | null; date?: string; start_time?: string; end_time?: string; role?: DbStaffRole; required_count?: number; location?: string | null; status?: string | null; notes?: string | null; updated_at?: string | null }
      >
      shift_assignments: DbTable<
        { id: string; shift_id: string; user_id: string; user_name: string; user_email: string; assigned_at: string | null; status: string | null },
        { id?: string; shift_id: string; user_id: string; user_name: string; user_email: string; assigned_at?: string | null; status?: string | null },
        { shift_id?: string; user_id?: string; user_name?: string; user_email?: string; status?: string | null }
      >
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}