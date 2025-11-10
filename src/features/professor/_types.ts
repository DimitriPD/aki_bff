export interface DashboardResponseDTO {
  teacher: { id: number; full_name: string; email: string; };
  classes: Array<{ id: number; name: string; student_count: number }>;
  upcoming_events: Array<{ id: string; class_name: string; start_time: string; end_time: string }>;
  recent_occurrences: Array<{ id: string; type: string; description: string; created_at: string }>;
  stats: { total_events: number; total_attendances: number; total_occurrences: number };
}