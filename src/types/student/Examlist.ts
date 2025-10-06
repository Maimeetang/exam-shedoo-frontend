export interface ExamStudent {
  id: number;
  course_code: string;
  course_name: string;
  lec_section: string;
  lab_section: string;
  midterm_date: string | null;
  midterm_start_time: string | null;
  midterm_end_time: string | null;
  final_date: string | null;
  final_start_time: string | null;
  final_end_time: string | null;
}

export type ExamStudentList = ExamStudent[];
