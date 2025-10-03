export interface ScrapeCourseJobInput {
  start: string;
  end: string;
  workers: number;
}

export interface ScrapeCourseJob {
  ID: number;
  StartCode: string;
  EndCode: string;
  Workers: number;
  Status: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface PostJobResponse {
  job_id: number;
  status: string;
}
