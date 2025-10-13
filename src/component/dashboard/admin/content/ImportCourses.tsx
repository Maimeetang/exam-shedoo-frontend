"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Button, Input, Select } from "antd";
import {
  PostJobResponse,
  ScrapeCourseJobInput,
  Status,
} from "@/types/admin/ScrapeJob";
import axios from "axios";
const { Option } = Select;

interface prop {
  status: Status;
  setError: (error: string) => void;
  setID: (id: number) => void;
  setStatus: (status: Status) => void;
}

export default function ImportCourseContent({
  status,
  setError,
  setID,
  setStatus,
}: prop) {
  const [isLoading, setIsLoading] = useState(false);
  const [scrapeCourseJobInput, setScrapeCourseJobInput] =
    useState<ScrapeCourseJobInput>({ start: "", end: "", workers: 4 });

  function createScrapeCourseJob() {
    setIsLoading(true);
    axios
      .post<PostJobResponse>(
        "/api/admin/scrape/course/start",
        scrapeCourseJobInput
      )
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
    <div className="flex flex-row gap-2 items-center">
      Start:{" "}
      <Input
        type="number"
        className="!w-30"
        value={scrapeCourseJobInput.start}
        // disabled={isLoading || status !== "waiting"}
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
        className="!w-30"
        value={scrapeCourseJobInput.end}
        // disabled={isLoading || status !== "waiting"}
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
        // disabled={isLoading || status !== "waiting"}
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
      <Button
        className="!w-24"
        onClick={() => createScrapeCourseJob()}
        // disabled={
        //   isLoading ||
        //   status !== "waiting" ||
        //   !scrapeCourseJobInput.start ||
        //   !scrapeCourseJobInput.end
        // }
        loading={isLoading}
      >
        Start
      </Button>
    </div>
  );
}
