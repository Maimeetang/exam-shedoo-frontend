"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Input, Select, Tag } from "antd";
import {
  PostJobResponse,
  ScrapeCourseJob,
  ScrapeCourseJobInput,
} from "@/types/admin/ScrapeCourseJob";
import axios from "axios";
import ImportCourseContent from "./content/ImportCourses";
import ImportExamContent from "./content/ImportExam";

const { Text } = Typography;
const { Option } = Select;

interface JobRow {
  key: string;
  job: React.ReactNode;
  content: React.ReactNode;
  status: React.ReactNode;
}

function getStatusColor(status?: string) {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return "green";
    case "running":
      return "blue";
    case "failed":
      return "red";
    case "pending":
      return "gold";
    default:
      return "default";
  }
}

interface prop {
  setError: (error: string) => void;
}

export default function AdminDashboard({ setError }: prop) {
  const [scrapeCourseJobStatus, setScrapeCourseJobStatus] =
    useState<string>("Waiting");
  const [scrapeExamJobStatus, setScrapeExamJobStatus] =
    useState<string>("Waiting");
  const [uploadExcelStatus, setUploadExcelStatus] = useState<string>("Waiting");
  const [uploadPdfStatus, setUploadPdfStatus] = useState<string>("Waiting");

  //   function getScrapeCourseJobStatus(id: number) {
  //     if (!id) return;
  //     axios
  //       .get<ScrapeCourseJob>(`/api/admin/scrape/course/status/${id}`)
  //       .then((res) => {
  //         if (res.data) {
  //           setScrapeCourseJobStatus(res.data.Status);
  //         }
  //       })
  //       .catch((err) => {
  //         setError(err.message || "Something went wrong");
  //       });
  //   }

  //   function getScrapeExamJobStatus(jobID: string) {
  //     if (!jobID) return;
  //     axios
  //       .get<PostJobResponse>(`/api/admin/scrape/exams/status/${jobID}`)
  //       .then((res) => {
  //         if (res.data) {
  //           setScrapeExamJobStatus(res.data.status);
  //         }
  //       })
  //       .catch((err) => {
  //         setError(err.message || "Something went wrong");
  //       });
  //   }

  //   function uploadEnrollments(file: File) {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     axios
  //       .post<{ message: string }>("/api/admin/enrollments/upload", formData, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       })
  //       .then((res) => {
  //         if (res.data) {
  //           setUploadExcelStatus(res.data.message); // ตัวอย่าง: "Imported N records"
  //         }
  //       })
  //       .catch((err) => {
  //         setError(err.message || "Something went wrong");
  //       });
  //   }

  const jobs: JobRow[] = [
    {
      key: "1",
      job: "1. Import courses",
      content: (
        <ImportCourseContent
          setError={setError}
          setScrapeCourseJobStatus={setScrapeCourseJobStatus}
        />
      ),
      status: (
        <Tag color={getStatusColor(scrapeCourseJobStatus)}>
          {scrapeCourseJobStatus}
        </Tag>
      ),
    },
    {
      key: "2",
      job: "2. Upload Enrolment.xlsx",
      content: <Button className="!w-24">Upload</Button>,
      status: (
        <Tag color={getStatusColor(uploadExcelStatus)}>{uploadExcelStatus}</Tag>
      ),
    },
    {
      key: "3",
      job: (
        <div>
          3. Import Exam from REG CMU <br />
        </div>
      ),
      content: (
        <ImportExamContent
          setError={setError}
          setScrapeExamJobStatus={setScrapeExamJobStatus}
        />
      ),
      status: (
        <Tag color={getStatusColor(scrapeExamJobStatus)}>
          {scrapeExamJobStatus}
        </Tag>
      ),
    },
    {
      key: "4",
      job: (
        <div>
          4. Import Exam from Faculty.pdf <br />
        </div>
      ),
      content: (
        <div className="flex flex-row gap-2 items-center justify-end">
          Type:{" "}
          <Select defaultValue="Midterm" className="w-24 text-center">
            <Option value="Midterm">Midterm</Option>
            <Option value="Final">Final</Option>
          </Select>
          <Button className="!w-24">Upload</Button>
        </div>
      ),
      status: (
        <Tag color={getStatusColor(uploadPdfStatus)}>{uploadPdfStatus}</Tag>
      ),
    },
  ];

  return (
    <div style={{ flex: 2.5, padding: "0 20px" }}>
      <Text
        type="secondary"
        style={{ color: "#ae9eb3", marginBottom: 10, display: "block" }}
      >
        Please follow by step wait before process completed.
      </Text>
      <Table<JobRow>
        pagination={false}
        dataSource={jobs}
        rowKey="key"
        columns={[
          {
            title: "Job",
            dataIndex: "job",
            render: (val: React.ReactNode) => <div>{val}</div>,
          },
          {
            dataIndex: "content",
            render: (val: React.ReactNode) => <div>{val}</div>,
            width: 240,
            align: "end" as const,
          },
          {
            title: "Status",
            dataIndex: "status",
            width: 110,
            align: "center" as const,
          },
        ]}
        showHeader={true}
        bordered={false}
      />
    </div>
  );
}
