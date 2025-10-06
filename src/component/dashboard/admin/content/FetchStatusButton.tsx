import {
  ScrapeCourseJob,
  ScrapeExamJob,
  Status,
} from "@/types/admin/ScrapeJob";
import { Button } from "antd";
import axios from "axios";
import { useState } from "react";

interface prop {
  setError: (error: string) => void;
  scrapeCourseJobID?: number;
  setScrapeCourseJobStatus: (status: Status) => void;
  scrapeExamJobID?: number;
  setScrapeExamJobStatus: (status: Status) => void;
}

export default function FetchStatusButton({
  setError,
  scrapeCourseJobID,
  setScrapeCourseJobStatus,
  scrapeExamJobID,
  setScrapeExamJobStatus,
}: prop) {
  const [loading, setLoading] = useState(false);

  async function getScrapeCourseJobStatus(id?: number) {
    if (!id) return;
    const res = await axios.get<ScrapeCourseJob>(
      `/api/admin/scrape/course/status/${id}`
    );
    if (res.data) setScrapeCourseJobStatus(res.data.Status);
  }

  async function getScrapeExamJobStatus(id?: number) {
    if (!id) return;
    const res = await axios.get<ScrapeExamJob>(
      `/api/admin/scrape/exams/status/${id}`
    );
    if (res.data) setScrapeExamJobStatus(res.data.Status);
  }

  async function handleFetch() {
    setLoading(true);
    try {
      await Promise.all([
        getScrapeCourseJobStatus(scrapeCourseJobID),
        getScrapeExamJobStatus(scrapeExamJobID),
      ]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end mb-4">
      <Button
        className="!bg-[#F7A97B] !text-black hover:!bg-[#ed994b] border-none"
        type="primary"
        loading={loading}
        onClick={handleFetch}
      >
        Fetch Status
      </Button>
    </div>
  );
}
