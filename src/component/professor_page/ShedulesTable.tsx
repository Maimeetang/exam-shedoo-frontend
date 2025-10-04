"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Spinner from "../Spinner";

interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  lec_section: string;
  lab_section: string;
  student_count: number;
}

interface ExamSlot {
  date: string;
  start_time: string;
  end_time: string;
  courses: Course[];
}

interface ExamReport {
  midterm: ExamSlot[];
  final: ExamSlot[];
}

interface Props {
  courseIds: string[];
  type?: "midterm" | "final";
}

const ScheduleTable: React.FC<Props> = ({ courseIds, type = "midterm" }) => {
  const [reports, setReports] = useState<ExamReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const promises = courseIds.map((id) =>
          axios.get<ExamReport>(`/api/professors/course_exams/report/${id}`)
        );
        const responses = await Promise.all(promises);
        setReports(responses.map((r) => r.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [courseIds]);

  const allSlots: ExamSlot[] = useMemo(() => {
    return reports.flatMap((r) => r[type] ?? []);
  }, [reports, type]);

  const mergedSlots = useMemo(() => {
    const map = new Map<string, ExamSlot>();
    allSlots.forEach((slot) => {
      const date = (slot.date ?? "").trim();
      const start = (slot.start_time ?? "").trim();
      const end = (slot.end_time ?? "").trim();
      const key = `${date}|${start}|${end}`;
      if (map.has(key)) {
        const ex = map.get(key)!;
        ex.courses.push(...slot.courses);
      } else {
        map.set(key, {
          date,
          start_time: start,
          end_time: end,
          courses: [...slot.courses],
        });
      }
    });
    return Array.from(map.values());
  }, [allSlots]);


  const parseDate = (raw: string) => {
    if (!raw) return new Date(NaN);
    const cleaned = raw.trim().replace(/\s+/g, " "); // normalize spaces
    const m = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
    if (!m) {
      // fallback: try Date constructor
      const d = new Date(cleaned);
      return isNaN(d.getTime()) ? new Date(NaN) : d;
    }
    const mon = m[1].slice(0, 3).toUpperCase();
    const day = parseInt(m[2], 10);
    const monthMap: Record<string, number> = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
    };
    const monthIdx = monthMap[mon] ?? NaN;
    if (isNaN(monthIdx)) return new Date(NaN);
    const year = new Date().getFullYear(); // use current year (API doesn't include year)
    return new Date(year, monthIdx, day);
  };

  const dates = useMemo(() => {
    const set = new Set<string>();
    mergedSlots.forEach((s) => set.add(s.date));
    const arr = Array.from(set);
    arr.sort((a, b) => {
      const da = parseDate(a).getTime();
      const db = parseDate(b).getTime();
      // if either is NaN, fall back to string compare to keep deterministic order
      if (isNaN(da) || isNaN(db)) return a.localeCompare(b);
      return da - db;
    });
    return arr;
  }, [mergedSlots]);

  const fixedTimes = ["0800-1100", "1200-1500", "1530-1830"];

  const times = fixedTimes

  // helper to find merged slot for a date+time
  const findSlot = (date: string, time: string) => {
    const [start, end] = time.split("-");
    return mergedSlots.find(
      (s) =>
        s.date === date &&
        (s.start_time ?? "").trim() === (start ?? "").trim() &&
        (s.end_time ?? "").trim() === (end ?? "").trim()
    );
  };

  const formatTime = (t: string) => t.replace(/(\d{2})(\d{2})/, "$1:$2");

  const formatDateForHeader = (dateStr: string) => {
    const d = parseDate(dateStr);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (isNaN(d.getTime())) {
      // fallback to raw string if parse failed
      return { day: dateStr, date: "" };
    }
    return {
      day: days[d.getDay()],
      date: `${d.getDate()} ${months[d.getMonth()]}.`,
    };
  };

  const getTotalStudents = (slot?: ExamSlot) =>
    slot ? slot.courses.reduce((s, c) => s + (c.student_count || 0), 0) : 0;

  const getSlotColor = (studentCount: number) => {
    if (studentCount === 0) return "bg-white";
    if (studentCount <= 5) return "bg-purple-200";
    if (studentCount <= 10) return "bg-green-200";
    if (studentCount <= 15) return "bg-yellow-200";
    if (studentCount <= 25) return "bg-orange-200";
    return "bg-pink-200";
  };

  const getDayHeaderColor = (index: number) => {
    const colors = [
      "bg-slate-600",
      "bg-slate-700",
      "bg-slate-500",
      "bg-emerald-700",
      "bg-emerald-600",
      "bg-slate-600",
      "bg-orange-500",
    ];
    return colors[index % 7];
  };

  if (loading) return <Spinner />;
  if (!reports.length) return <div className="text-center p-4">No data available</div>;

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-6 py-5">
        <h2 className="text-2xl font-semibold">
          {type === "midterm" ? "Midterm" : "Final"} Schedule — showing all dates & times from API
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `120px repeat(${dates.length || 1}, minmax(120px, 1fr))`,
            }}
          >
            {/* Header */}
            <div className="bg-purple-300 text-white font-semibold flex items-center justify-center p-4 border border-gray-200">
              Time
            </div>

            {dates.map((date, idx) => {
              const header = formatDateForHeader(date);
              return (
                <div
                  key={date + idx}
                  className={`${getDayHeaderColor(idx)} text-white font-semibold p-4 border border-gray-200 text-center`}
                >
                  <div className="text-base mb-1">{header.day}</div>
                  <div className="text-sm opacity-95">{header.date}</div>
                </div>
              );
            })}

            {times.map((time) => {
              const [startRaw, endRaw] = time.split("-");
              const start = formatTime(startRaw);
              const end = formatTime(endRaw);
              return (
                <React.Fragment key={time}>
                  {/* time cell */}
                  <div className="bg-purple-300 text-white font-semibold flex flex-col items-center justify-center p-4 border border-gray-200 gap-1">
                    <div>{start}</div>
                    <div>-</div>
                    <div>{end}</div>
                  </div>

                  {/* each date cell for this time */}
                  {dates.map((date) => {
                    const slot = findSlot(date, time);
                    const count = getTotalStudents(slot);
                    return (
                      <div
                        key={`${date}-${time}`}
                        className={`${getSlotColor(count)} flex items-center justify-center p-4 border border-gray-200 min-h-[80px]`}
                      >
                        {count > 0 ? (
                          <span className="font-semibold text-gray-800">
                            {count} {count === 1 ? "person" : "persons"}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}

            {/* If there were no times (no slots), show a placeholder row */}
            {times.length === 0 && (
              <>
                <div className="bg-purple-300 text-white font-semibold flex flex-col items-center justify-center p-4 border border-gray-200 gap-1">
                  <div>--</div>
                </div>
                {dates.map((date) => (
                  <div key={date + "-empty"} className="p-4 border border-gray-200 min-h-[80px]" />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTable;

