"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Button, Input } from "antd";
import { PostJobResponse, Status } from "@/types/admin/ScrapeJob";
import axios from "axios";

interface prop {
  status: Status;
  prevTaskStatus: Status;
  setError: (error: string) => void;
  setID: (id: number) => void;
  setStatus: (status: Status) => void;
}

export default function ImportExamContent({
  status,
  prevTaskStatus,
  setError,
  setID,
  setStatus,
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
          setID(res.data.job_id);
          setStatus(res.data.status);
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
        min={0}
        value={academicYear}
        disabled={isLoading || (status !== "waiting" && status !== "failed")}
        onChange={(e) => setAcademicYear(e.target.value)}
      />
      <span className="block text-xs text-gray-400">
        Ex. term 1, Year: 2568 will be 168
      </span>
      <Button
        className="!w-24"
        disabled={
          isLoading ||
          (status !== "waiting" && status !== "failed") ||
          !academicYear
        }
        loading={isLoading}
        onClick={() => createScrapeExamJob()}
      >
        Start
      </Button>
    </div>
  );
}
