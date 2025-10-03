"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Button, Input } from "antd";
import { PostJobResponse } from "@/types/admin/ScrapeCourseJob";
import axios from "axios";

interface prop {
  setError: (error: string) => void;
  setScrapeExamJobStatus: (status: string) => void;
}

export default function ImportExamContent({
  setError,
  setScrapeExamJobStatus,
}: prop) {
  const [academicYear, setAcademicYear] = useState<string>();

  function createScrapeExamJob() {
    if (!academicYear) return;
    axios
      .post<PostJobResponse>(`/api/admin/scrape/exams/start/${academicYear}`)
      .then((res) => {
        if (res.data) {
          setScrapeExamJobStatus(res.data.status);
        }
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
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
        onChange={(e) => setAcademicYear(e.target.value)}
      />
      <span className="block text-xs text-gray-400">
        Ex. term 1, Year: 2568
      </span>
      <Button className="!w-24" onClick={() => createScrapeExamJob()}>
        Start
      </Button>
    </div>
  );
}
