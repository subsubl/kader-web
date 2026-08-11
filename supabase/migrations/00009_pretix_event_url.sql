-- Kader — Add pretix_event_url to ra_events for per-event ticket widget mapping
alter table if exists ra_events add column if not exists pretix_event_url text;