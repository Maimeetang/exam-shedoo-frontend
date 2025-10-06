"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Typography, Table, Button, Select, Tag } from "antd";
import ImportCourseContent from "./content/ImportCourses";
import ImportExamContent from "./content/ImportExam";
import FetchStatusButton from "./content/FetchStatusButton";
import { Status } from "@/types/admin/ScrapeJob";
import UploadExcelButton from "./content/UploadExcelButton";
import UploadPdf from "./content/UploadPdf";

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
  // scrapeCourseJob
  const [scrapeCourseJobID, setScrapeCourseJobID] = useState<number>();
  const [scrapeCourseJobStatus, setScrapeCourseJobStatus] =
    useState<Status>("waiting");

  // scrapeExamJob
  const [scrapeExamJobID, setScrapeExamJobID] = useState<number>();
  const [scrapeExamJobStatus, setScrapeExamJobStatus] =
    useState<Status>("waiting");

  const [uploadExcelStatus, setUploadExcelStatus] = useState<Status>("waiting");
  const [uploadPdfStatus, setUploadPdfStatus] = useState<Status>("waiting");

  const jobs: JobRow[] = [
    {
      key: "1",
      job: "1. Import courses",
      content: (
        <ImportCourseContent
          status={scrapeCourseJobStatus}
          setError={setError}
          setID={setScrapeCourseJobID}
          setStatus={setScrapeCourseJobStatus}
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
      content: (
        <UploadExcelButton
          status={uploadExcelStatus}
          prevTaskStatus={scrapeCourseJobStatus}
          setStatus={setUploadExcelStatus}
        />
      ),
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
          status={scrapeExamJobStatus}
          prevTaskStatus={uploadExcelStatus}
          setError={setError}
          setID={setScrapeExamJobID}
          setStatus={setScrapeExamJobStatus}
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
          <UploadPdf
            status={uploadPdfStatus}
            prevTaskStatus={scrapeExamJobStatus}
            setStatus={setUploadPdfStatus}
          />
        </div>
      ),
      status: (
        <Tag color={getStatusColor(uploadPdfStatus)}>{uploadPdfStatus}</Tag>
      ),
    },
  ];

  return (
    <div style={{ flex: 2.5, padding: "0 20px" }}>
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
      <div className="flex flex-row items-strat justify-between my-5">
        <Text type="secondary" style={{ color: "#ae9eb3" }}>
          Please follow by step wait before process completed.
        </Text>
        <FetchStatusButton
          setError={setError}
          scrapeCourseJobID={scrapeCourseJobID}
          setScrapeCourseJobStatus={setScrapeCourseJobStatus}
          scrapeExamJobID={scrapeExamJobID}
          setScrapeExamJobStatus={setScrapeExamJobStatus}
        />
      </div>
    </div>
  );
}
