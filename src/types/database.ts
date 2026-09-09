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
      logbook_entries: DbTable<
        { id: string; entry_date: string; category: string; content: string; event_id: string | null; author_id: string | null; author_name: string | null; created_at: string | null },
        { id?: string; entry_date?: string; category?: string; content: string; event_id?: string | null; author_id?: string | null; author_name?: string | null; created_at?: string | null },
        { entry_date?: string; category?: string; content?: string; event_id?: string | null; author_id?: string | null; author_name?: string | null }
      >
      guests: DbTable<
        { id: string; name: string; email: string | null; phone: string | null; tags: string[] | null; is_blacklisted: boolean | null; blacklist_reason: string | null; notes: string | null; visit_count: number | null; last_visit_at: string | null; created_at: string | null; updated_at: string | null },
        { id?: string; name: string; email?: string | null; phone?: string | null; tags?: string[] | null; is_blacklisted?: boolean | null; blacklist_reason?: string | null; notes?: string | null; visit_count?: number | null; last_visit_at?: string | null; created_at?: string | null; updated_at?: string | null },
        { name?: string; email?: string | null; phone?: string | null; tags?: string[] | null; is_blacklisted?: boolean | null; blacklist_reason?: string | null; notes?: string | null; visit_count?: number | null; last_visit_at?: string | null; updated_at?: string | null }
      >
      vip_tables: DbTable<
        { id: string; name: string; location: string | null; capacity: number | null; min_spend: number | null; is_active: boolean | null; created_at: string | null },
        { id?: string; name: string; location?: string | null; capacity?: number | null; min_spend?: number | null; is_active?: boolean | null; created_at?: string | null },
        { name?: string; location?: string | null; capacity?: number | null; min_spend?: number | null; is_active?: boolean | null }
      >
      table_reservations: DbTable<
        { id: string; event_ra_id: number | null; event_label: string | null; guest_id: string | null; guest_name: string; guest_phone: string | null; table_id: string | null; party_size: number | null; min_spend: number | null; bottles_note: string | null; status: string | null; created_by: string | null; created_at: string | null },
        { id?: string; event_ra_id?: number | null; event_label?: string | null; guest_id?: string | null; guest_name: string; guest_phone?: string | null; table_id?: string | null; party_size?: number | null; min_spend?: number | null; bottles_note?: string | null; status?: string | null; created_by?: string | null; created_at?: string | null },
        { event_ra_id?: number | null; event_label?: string | null; guest_id?: string | null; guest_name?: string; guest_phone?: string | null; table_id?: string | null; party_size?: number | null; min_spend?: number | null; bottles_note?: string | null; status?: string | null; created_by?: string | null }
      >
      table_orders: DbTable<
        { id: string; table_number: number; items: Json; total: number; status: string; customer_note: string | null; created_at: string; updated_at: string },
        { id?: string; table_number: number; items: Json; total?: number; status?: string; customer_note?: string | null; created_at?: string; updated_at?: string },
        { table_number?: number; items?: Json; total?: number; status?: string; customer_note?: string | null; updated_at?: string }
      >
      promoter_commission_rates: DbTable<
        { id: string; event_id: string | null; rate_per_checkin: number; rate_type: string; created_at: string },
        { id?: string; event_id?: string | null; rate_per_checkin?: number; rate_type?: string; created_at?: string },
        { event_id?: string | null; rate_per_checkin?: number; rate_type?: string }
      >
      promoter_payouts: DbTable<
        { id: string; promoter_id: string; promoter_name: string; event_id: string | null; event_label: string | null; verified_checkins: number; commission_rate: number; total_payout: number; status: string; period_start: string | null; period_end: string | null; notes: string | null; created_at: string },
        { id?: string; promoter_id: string; promoter_name: string; event_id?: string | null; event_label?: string | null; verified_checkins?: number; commission_rate: number; total_payout?: number; status?: string; period_start?: string | null; period_end?: string | null; notes?: string | null; created_at?: string },
        { promoter_id?: string; promoter_name?: string; event_id?: string | null; event_label?: string | null; verified_checkins?: number; commission_rate?: number; total_payout?: number; status?: string; period_start?: string | null; period_end?: string | null; notes?: string | null }
      >
      event_pnl: DbTable<
        { id: string; event_id: string | null; event_label: string; event_date: string | null; ticket_revenue: number; bar_revenue: number; door_revenue: number; other_revenue: number; staff_cost: number; promoter_cost: number; artist_fee: number; venue_cost: number; other_cost: number; total_revenue: number; total_cost: number; net_profit: number; attendance: number | null; notes: string | null; status: string; created_by: string | null; created_at: string; updated_at: string },
        { id?: string; event_id?: string | null; event_label: string; event_date?: string | null; ticket_revenue?: number; bar_revenue?: number; door_revenue?: number; other_revenue?: number; staff_cost?: number; promoter_cost?: number; artist_fee?: number; venue_cost?: number; other_cost?: number; attendance?: number | null; notes?: string | null; status?: string; created_by?: string | null; created_at?: string; updated_at?: string },
        { event_id?: string | null; event_label?: string; event_date?: string | null; ticket_revenue?: number; bar_revenue?: number; door_revenue?: number; other_revenue?: number; staff_cost?: number; promoter_cost?: number; artist_fee?: number; venue_cost?: number; other_cost?: number; attendance?: number | null; notes?: string | null; status?: string; created_by?: string | null; updated_at?: string }
      >
      calendar_notes: DbTable<
        { id: string; date: string; event_id: string | null; title: string; content: string | null; category: string; author_id: string | null; author_name: string | null; created_at: string; updated_at: string },
        { id?: string; date: string; event_id?: string | null; title: string; content?: string | null; category?: string; author_id?: string | null; author_name?: string | null; created_at?: string; updated_at?: string },
        { date?: string; event_id?: string | null; title?: string; content?: string | null; category?: string; author_id?: string | null; author_name?: string | null; updated_at?: string }
      >
      team_tasks: DbTable<
        { id: string; title: string; description: string | null; category: string; assigned_role: string; assigned_user_id: string | null; task_type: string; due_date: string | null; recurrence_days: Json | null; is_active: boolean; created_by: string | null; created_by_name: string | null; created_at: string; updated_at: string },
        { id?: string; title: string; description?: string | null; category?: string; assigned_role?: string; assigned_user_id?: string | null; task_type?: string; due_date?: string | null; recurrence_days?: Json | null; is_active?: boolean; created_by?: string | null; created_by_name?: string | null; created_at?: string; updated_at?: string },
        { title?: string; description?: string | null; category?: string; assigned_role?: string; assigned_user_id?: string | null; task_type?: string; due_date?: string | null; recurrence_days?: Json | null; is_active?: boolean; updated_at?: string }
      >
      team_task_completions: DbTable<
        { id: string; task_id: string; completion_date: string; completed_by: string | null; completed_by_name: string | null; completed_at: string },
        { id?: string; task_id: string; completion_date: string; completed_by?: string | null; completed_by_name?: string | null; completed_at?: string },
        { task_id?: string; completion_date?: string; completed_by?: string | null; completed_by_name?: string | null }
      >
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}