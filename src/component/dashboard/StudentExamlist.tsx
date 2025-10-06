"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import ExportButton from "@/component/dashboard/ExportButton";
import "@ant-design/v5-patch-for-react-19";
import axios from "axios";
import Spinner from "../Spinner";
import { tableColors, dayColors } from "@/types/Color";
import { formatTime, parseDate } from "@/utils/date";
import type { ExamStudent } from "@/types/student/Examlist";

interface Props {
  studentId: string;
  type?: "midterm" | "final";
}

const formatDateForHeader = (dateStr: string) => {
  const d = parseDate(dateStr);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (isNaN(d.getTime())) {
    return { day: dateStr, date: "" };
  }
  return {
    day: days[d.getDay()],
    date: `${d.getDate()} ${months[d.getMonth()]}.`,
  };
};

const getRandomColor = (() => {
  const colorKeys = Object.keys(dayColors);
  let available: string[] = [];

  return () => {
    if (available.length === 0) {
      available = [...colorKeys];
    }
    const idx = Math.floor(Math.random() * available.length);
    const key = available.splice(idx, 1)[0];
    return dayColors[key];
  };
})();

export function getHeaderTextColor(dateString: string): string {
  let key: string;
  switch (dateString) {
    case "Monday":
      key = "M";
      break;
    case "Tuesday":
      key = "Tu";
      break;
    case "Wednesday":
      key = "We";
      break;
    case "Thursday":
      key = "Th";
      break;
    case "Friday":
      key = "F";
      break;
    case "Saturday":
      key = "Sa";
      break;
    case "Sunday":
      key = "Su";
      break;
    default:
      key = "M";
  }

  return dayColors[key];
}

const StudentExamSchedule: React.FC<Props> = ({
  studentId,
  type = "midterm",
}) => {
  const [exams, setExams] = useState<ExamStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get<ExamStudent[]>(
          `/api/students/exams/${studentId}`
        );
        setExams(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [studentId]);

  const filtered = useMemo(() => {
    return exams.filter((e) =>
      type === "midterm"
        ? e.midterm_date && e.midterm_start_time && e.midterm_end_time
        : e.final_date && e.final_start_time && e.final_end_time
    );
  }, [exams, type]);

  const tableRef = useRef<HTMLDivElement>(null);

  const dates = useMemo(() => {
    const dateSet = new Set<string>();
    filtered.forEach((e) => {
      const date = type === "midterm" ? e.midterm_date! : e.final_date!;
      dateSet.add(date);
    });

    const arr = Array.from(dateSet).sort(
      (a, b) => parseDate(a).getTime() - parseDate(b).getTime()
    );

    if (arr.length === 0) return arr;

    const start = parseDate(arr[0]);
    const end = parseDate(arr[arr.length - 1]);
    const filled: string[] = [];
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDate();
      const month = current
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();
      filled.push(`${month}  ${day}`);
      current.setDate(current.getDate() + 1);
    }
    return filled;
  }, [filtered, type]);

  const times = ["0800-1100", "1200-1500", "1530-1830"];

  const findExam = (dateStr: string, time: string) => {
    const [start, end] = time.split("-");

    const targetDate = parseDate(dateStr);
    if (isNaN(targetDate.getTime())) return undefined;

    return filtered.find((e) => {
      const eDateStr = type === "midterm" ? e.midterm_date : e.final_date;
      const eStart =
        (type === "midterm" ? e.midterm_start_time : e.final_start_time) ?? "";
      const eEnd =
        (type === "midterm" ? e.midterm_end_time : e.final_end_time) ?? "";

      if (!eDateStr) return false;

      const examDate = parseDate(eDateStr);
      if (isNaN(examDate.getTime())) return false;

      // เปรียบเทียบวันโดยไม่สนใจเวลา
      const sameDay =
        examDate.getFullYear() === targetDate.getFullYear() &&
        examDate.getMonth() === targetDate.getMonth() &&
        examDate.getDate() === targetDate.getDate();

      return (
        sameDay &&
        eStart.replace(":", "") === start &&
        eEnd.replace(":", "") === end
      );
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl my-20 shadow-lg overflow-hidden">
      <div ref={tableRef}>
        <div
          className="text-white px-6 py-5"
          style={{ backgroundColor: tableColors.primary }}
        >
          <h2 className="text-2xl font-bold">
            {type === "midterm" ? "Midterm" : "Final"} Exam Schedule
          </h2>
        </div>

        <div className="overflow-x-auto">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `120px repeat(${
                dates.length || 1
              }, minmax(120px, 1fr))`,
              gridTemplateRows: `90px repeat(${times.length}, 140px)`,
            }}
          >
            <div
              className="text-white font-bold flex items-center justify-center border border-gray-200"
              style={{ backgroundColor: tableColors.primary }}
            >
              Time
            </div>

            {dates.map((date, idx) => {
              const header = formatDateForHeader(date);
              const textColor = getHeaderTextColor(header.day);
              return (
                <div
                  key={date + idx}
                  className={`font-semibold p-4 border border-gray-200 text-center`}
                  style={{
                    color: textColor,
                    backgroundColor: tableColors.secondary,
                  }}
                >
                  <div className="text-base mb-1">{header.day}</div>
                  <div className="text-sm">{header.date}</div>
                </div>
              );
            })}

            {times.map((time) => {
              const [startRaw, endRaw] = time.split("-");
              const start = formatTime(startRaw);
              const end = formatTime(endRaw);
              return (
                <React.Fragment key={time}>
                  <div
                    className="text-white font-bold flex flex-col items-center justify-center border border-gray-200"
                    style={{ backgroundColor: tableColors.primary }}
                  >
                    <div>{start}</div>
                    <div>-</div>
                    <div>{end}</div>
                  </div>

                  {dates.map((date, idx) => {
                    const exam = findExam(date, time);
                    return (
                      <div
                        key={`${date}-${idx}`}
                        className="border border-gray-200 flex flex-col justify-center items-center"
                        style={{
                          backgroundColor: exam ? getRandomColor() : undefined,
                        }}
                      >
                        {exam ? (
                          <div className="text-center font-semibold">
                            <div>{exam.course_code}</div>
                            <div>{exam.course_name}</div>
                            <div>Sec. {exam.lec_section}</div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-end px-4 py-2 rounded-b-md">
        <ExportButton
          targetRef={tableRef as React.RefObject<HTMLElement>}
          fileName={`course_schedule_${
            type === "midterm" ? "Midterm" : "Final"
          }.png`}
        />
      </div>
    </div>
  );
};

export default StudentExamSchedule;
