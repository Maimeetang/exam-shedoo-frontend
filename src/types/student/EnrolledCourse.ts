interface Instructor {
  name: string;
}

export interface EnrolledCourse {
  id: number;
  course_code: string;
  course_name: string;
  lec_section: string;
  lab_section: string;
  lec_credit: number;
  lab_credit: number;
  instructors: Instructor[];
  room: string;
  days: string;
  semester: string;
  year: string;
  start_time: string;
  end_time: string;
}
