export interface Enrollment {
  id: number;
  course_code: string;
  course_name: string;
  lec_section: string;
  lab_section: string;
  credit: number;
  instructors: string[];
  room: string;
  days: string;
  start_time: string;
  end_time: string;
}
