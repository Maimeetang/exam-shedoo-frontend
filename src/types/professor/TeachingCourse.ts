export interface TeachingCourse {
  course_id: number;
  course_code: string;
  course_name: string;
  lec_section: string;
  lab_section: string;
  midterm_date: Date;
  midterm_start_time: string;
  midterm_end_time: string;
  final_date: Date;
  final_start_time: string;
  final_end_time: string;
}
