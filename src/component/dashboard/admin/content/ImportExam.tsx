"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Button, Input } from "antd";
import { PostJobResponse, Status } from "@/types/admin/ScrapeJob";
import axios from "axios";

interface prop {
  status: Status;
  setError: (error: string) => void;
  setScrapeExamJobID: (id: number) => void;
  setScrapeExamJobStatus: (status: Status) => void;
}

export default function ImportExamContent({
  status,
  setError,
  setScrapeExamJobID,
  setScrapeExamJobStatus,
}: prop) {
  const [isLoading, setIsLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState<string>();

  function createScrapeExamJob() {
    if (!academicYear) return;
    setIsLoading(true);
    axios
      .post<PostJobResponse>(`/api/admin/scrape/exams/start/${academicYear}`)
      .then((res) => {
        if (res.data) {
          setScrapeExamJobID(res.data.job_id);
          setScrapeExamJobStatus(res.data.status);
        }
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="flex flex-row gap-2 items-center justify-end">
      Academic Year:{" "}
      <Input
        type="number"
        placeholder="168"
        className="!w-20"
        value={academicYear}
        disabled={isLoading || status !== "waiting"}
        onChange={(e) => setAcademicYear(e.target.value)}
      />
      <span className="block text-xs text-gray-400">
        Ex. term 1, Year: 2568
      </span>
      <Button
        className="!w-24"
        disabled={isLoading || status !== "waiting" || !academicYear}
        loading={isLoading}
        onClick={() => createScrapeExamJob()}
      >
        Start
      </Button>
    </div>
  );
}
