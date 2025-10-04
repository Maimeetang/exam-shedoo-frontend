export type Status = "waiting" | "pending" | "running" | "completed";

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
  Status: Status;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface ScrapeExamJob {
  ID: number;
  Term: string;
  Status: Status;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface PostJobResponse {
  job_id: number;
  status: Status;
}
