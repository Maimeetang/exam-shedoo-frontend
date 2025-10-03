"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Button, Input, Select } from "antd";
import {
  PostJobResponse,
  ScrapeCourseJobInput,
} from "@/types/admin/ScrapeCourseJob";
import axios from "axios";
const { Option } = Select;

interface prop {
  setError: (error: string) => void;
  setScrapeCourseJobStatus: (status: string) => void;
}

export default function ImportCourseContent({
  setError,
  setScrapeCourseJobStatus,
}: prop) {
  const [scrapeCourseJobInput, setScrapeCourseJobInput] =
    useState<ScrapeCourseJobInput>({ start: "", end: "", workers: 4 });

  function createScrapeCourseJob() {
    axios
      .post<PostJobResponse>(
        "/api/admin/scrape/course/start",
        scrapeCourseJobInput
      )
      .then((res) => {
        if (res.data) {
          setScrapeCourseJobStatus(res.data.status);
        }
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      });
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      Start:{" "}
      <Input
        type="number"
        className="!w-20"
        value={scrapeCourseJobInput.start}
        onChange={(e) =>
          setScrapeCourseJobInput({
            ...scrapeCourseJobInput,
            start: e.target.value,
          })
        }
      />
      End:{" "}
      <Input
        type="number"
        className="!w-20"
        value={scrapeCourseJobInput.end}
        onChange={(e) =>
          setScrapeCourseJobInput({
            ...scrapeCourseJobInput,
            end: e.target.value,
          })
        }
      />
      Worker:
      <Select
        className="!w-16 !text-center"
        value={scrapeCourseJobInput.workers}
        onChange={(value) =>
          setScrapeCourseJobInput({
            ...scrapeCourseJobInput,
            workers: value,
          })
        }
      >
        <Option value="4">4</Option>
        <Option value="8">8</Option>
      </Select>
      <Button className="!w-24" onClick={() => createScrapeCourseJob()}>
        Start
      </Button>
    </div>
  );
}
