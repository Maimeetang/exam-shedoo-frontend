"use client";
import React, { useMemo, useRef } from "react";
import ExportButton from "@/component/dashboard/ExportButton";
import "@ant-design/v5-patch-for-react-19";
import Spinner from "../Spinner";
import { tableColors, dayColors } from "@/types/Color";
import { parseDate } from "@/utils/date";
import type { ExamStudent } from "@/types/student/Examlist";
import { useQuery } from "@tanstack/react-query";

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
  if (isNaN(d.getTime())) return { day: dateStr, date: "" };
  return {
    day: days[d.getDay()],
    date: `${d.getDate()} ${months[d.getMonth()]}.`,
  };
};

const getRandomColor = (() => {
  const colorKeys = Object.keys(dayColors);
  let available: string[] = [];
  return () => {
    if (available.length === 0) available = [...colorKeys];
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
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ["student-exams", studentId],
    queryFn: async () => {
      const res = await fetch(`/api/students/exams/${studentId}`);
      return (await res.json()) as ExamStudent[];
    },
    enabled: !!studentId,
    refetchOnWindowFocus: false,
  });

  const filtered = useMemo(
    () =>
      exams.filter((e) =>
        type === "midterm"
          ? e.midterm_date && e.midterm_start_time && e.midterm_end_time
          : e.final_date && e.final_start_time && e.final_end_time
      ),
    [exams, type]
  );

  const tableRef = useRef<HTMLDivElement>(null);

  // สร้าง array ของวันทั้งหมดตั้งแต่วันแรก–วันสุดท้าย
  const dates = useMemo(() => {
    if (filtered.length === 0) return [];

    const allDates = filtered
      .map((e) => (type === "midterm" ? e.midterm_date! : e.final_date!))
      .map((d) => parseDate(d))
      .filter((d) => !isNaN(d.getTime()));

    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    let maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    // ✅ ถ้าช่วงวันน้อยกว่า 7 วัน → บังคับให้ maxDate = minDate + 6 วัน
    const diffDays = Math.floor(
      (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 6) {
      maxDate = new Date(minDate);
      maxDate.setDate(minDate.getDate() + 6);
    }

    const filled: string[] = [];
    const current = new Date(minDate);
    while (current <= maxDate) {
      const day = current.getDate();
      const month = current
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();
      filled.push(`${month}  ${day}`);
      current.setDate(current.getDate() + 1);
    }

    return filled;
  }, [filtered, type]);

  // min/max ชั่วโมง
  const hoursRange = useMemo(() => {
    let minHour = 8;
    let maxHour = 19;
    filtered.forEach((slot) => {
      const start = parseInt(
        (type === "midterm"
          ? slot.midterm_start_time
          : slot.final_start_time
        )?.slice(0, 2) ?? "0",
        10
      );
      const end = parseInt(
        (type === "midterm"
          ? slot.midterm_end_time
          : slot.final_end_time
        )?.slice(0, 2) ?? "0",
        10
      );
      if (start < minHour) minHour = start;
      if (end > maxHour) maxHour = end;
    });
    return { minHour, maxHour };
  }, [filtered, type]);

  if (isLoading) return <Spinner />;

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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
          <div className="inline-block min-w-full relative">
            {/* Grid layout: hours on Y axis, dates on X axis */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `80px repeat(${dates.length}, minmax(160px, 1fr))`,
                gridTemplateRows: `repeat(${
                  hoursRange.maxHour - hoursRange.minHour + 2
                }, 80px)`, // 24 hours
              }}
            >
              {/* Top-left cell: Time header */}
              <div
                className="border-b border-r border-gray-200 flex items-center justify-center font-semibold sticky top-0 z-10 bg-white"
                style={{ gridColumn: 1, gridRow: 1 }}
              >
                Time
              </div>

              {/* Date headers */}
              {dates.map((date, idx) => {
                const header = formatDateForHeader(date);
                const textColor = getHeaderTextColor(header.day);
                return (
                  <div
                    key={`header-${idx}`}
                    className="border-b border-gray-200 flex flex-col items-center justify-center p-2 text-center font-semibold sticky top-0 z-10"
                    style={{
                      gridColumn: idx + 2,
                      gridRow: 1,
                      color: textColor,
                      backgroundColor: tableColors.secondary,
                    }}
                  >
                    <div className="text-base">{header.day}</div>
                    <div className="text-sm">{header.date}</div>
                  </div>
                );
              })}
              {/* Time column */}
              {Array.from({
                length: hoursRange.maxHour - hoursRange.minHour + 1,
              }).map((_, idx) => {
                const hour = hoursRange.minHour + idx;
                return (
                  <div
                    key={`time-${hour}`}
                    className="border-b border-gray-200 border-r flex items-start justify-center text-sm text-gray-600 pt-1"
                    style={{
                      gridColumn: 1,
                      gridRow: idx + 2,
                    }}
                  >
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                );
              })}

              {/* Time grid cells */}
              {dates.map((_, dateIdx) =>
                Array.from({
                  length: hoursRange.maxHour - hoursRange.minHour + 1,
                }).map((_, idx) => {
                  const hour = hoursRange.minHour + idx;
                  return (
                    <div
                      key={`cell-${dateIdx}-${hour}`}
                      className="border-b border-r border-gray-100 relative"
                      style={{
                        gridColumn: dateIdx + 2,
                        gridRow: idx + 2,
                      }}
                    ></div>
                  );
                })
              )}
            </div>

            {/* Overlay exams */}
            <div className="absolute top-0 left-[80px] right-0 bottom-0">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${dates.length}, minmax(160px, 1fr))`,
                  position: "relative",
                  height: `${
                    (hoursRange.maxHour - hoursRange.minHour + 1) * 80 + 80
                  }px`,
                }}
              >
                {filtered.map((slot, sIdx) => {
                  const slotDate = parseDate(
                    type === "midterm" ? slot.midterm_date! : slot.final_date!
                  );
                  console.log(
                    "slotDate parsed:",
                    slot.midterm_date,
                    "→",
                    slotDate
                  );
                  const dateIdx = dates.findIndex((d) => {
                    const dParsed = parseDate(d);
                    return (
                      dParsed.getFullYear() === slotDate.getFullYear() &&
                      dParsed.getMonth() === slotDate.getMonth() &&
                      dParsed.getDate() === slotDate.getDate()
                    );
                  });
                  if (dateIdx === -1) return null;

                  const startTime =
                    type === "midterm"
                      ? slot.midterm_start_time!
                      : slot.final_start_time!;
                  const endTime =
                    type === "midterm"
                      ? slot.midterm_end_time!
                      : slot.final_end_time!;
                  const startH = parseInt(startTime.slice(0, 2), 10);
                  const startM = parseInt(startTime.slice(2, 4), 10);
                  const endH = parseInt(endTime.slice(0, 2), 10);
                  const endM = parseInt(endTime.slice(2, 4), 10);

                  const hourHeight = 80;
                  const top =
                    hourHeight + (startH + startM / 60 - 8) * hourHeight;
                  const height = Math.max(
                    (endH + endM / 60 - startH - startM / 60) * hourHeight,
                    40
                  );

                  return (
                    <div
                      key={sIdx}
                      className="absolute left-1 right-1 text-xs p-2 text-[#303030] shadow flex flex-col items-center justify-center overflow-hidden"
                      style={{
                        top,
                        height,
                        gridColumnStart: dateIdx + 1,
                        gridColumnEnd: dateIdx + 1,
                        position: "absolute",
                        backgroundColor: getRandomColor() + "99",
                      }}
                    >
                      <div className="font-bold text-[16px] mt-1">
                        {slot.course_code}
                      </div>
                      <div className="text-[14px]">{`${startTime}-${endTime}`}</div>
                      <div className="text-[12px] text-center">
                        {slot.course_name}
                      </div>
                      <div className="text-[12px]">Sec. {slot.lec_section}</div>
                    </div>
                  );
                })}
              </div>
            </div>
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
