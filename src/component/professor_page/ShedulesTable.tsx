"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Spinner from "../Spinner";
import { tableColors } from "@/types/Color";
import { getHeaderTextColor, getStudentBgColor } from "@/utils/color";
import { formatTime } from "@/utils/date";
import { Modal, Table } from "antd";

interface Student {
  student_code: string;
}

interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  lec_section: string;
  lab_section: string;
  students: Student[];
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
  courseName?: string;
  type?: "midterm" | "final";
}

const ScheduleTable: React.FC<Props> = ({ courseIds, courseName, type = "midterm" }) => {
  const [reports, setReports] = useState<ExamReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<ExamSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        const existing = map.get(key)!;

        slot.courses.forEach((c) => {
          const existingCourse = existing.courses.find(
            (ec) =>
              ec.course_id === c.course_id &&
              ec.lec_section === c.lec_section &&
              ec.lab_section === c.lab_section
          );

          if (existingCourse) {
            // Merge students without duplicates
            const studentMap = new Map<string, Student>();
            existingCourse.students.forEach((s) => studentMap.set(s.student_code, s));
            c.students.forEach((s) => studentMap.set(s.student_code, s));
            existingCourse.students = Array.from(studentMap.values());
          } else {
            existing.courses.push({ ...c, students: [...c.students] });
          }
        });
      } else {
        map.set(key, { date, start_time: start, end_time: end, courses: slot.courses.map(c => ({ ...c, students: [...c.students] })) });
      }
    });

    return Array.from(map.values());
  }, [allSlots]);

  const parseDate = (raw: string) => {
    if (!raw) return new Date(NaN);
    const cleaned = raw.trim().replace(/\s+/g, " ");
    const m = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
    if (!m) {
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
    const year = new Date().getFullYear();
    return new Date(year, monthIdx, day);
  };

  const dates = useMemo(() => {
    const set = new Set<string>();
    mergedSlots.forEach((s) => set.add(s.date));

    const arr = Array.from(set);
    arr.sort((a, b) => {
      const da = parseDate(a).getTime();
      const db = parseDate(b).getTime();
      if (isNaN(da) || isNaN(db)) return a.localeCompare(b);
      return da - db;
    });

    if (arr.length > 0) {
      const start = parseDate(arr[0]);
      const end = parseDate(arr[arr.length - 1]);
      const filled: string[] = [];
      let current = new Date(start);

      while (current <= end) {
        const day = current.getDate();
        const month = current.toLocaleString("en-US", { month: "short" }).toUpperCase();
        filled.push(`${month}  ${day}`);
        current.setDate(current.getDate() + 1);
      }
      return filled;
    }
    return arr;
  }, [mergedSlots]);


  const times = ["0800-1100", "1200-1500", "1530-1830"]

  const findSlot = (date: string, time: string) => {
    const [start, end] = time.split("-");
    return mergedSlots.find(
      (s) =>
        s.date === date &&
        (s.start_time ?? "").trim() === (start ?? "").trim() &&
        (s.end_time ?? "").trim() === (end ?? "").trim()
    );
  };

  const formatDateForHeader = (dateStr: string) => {
    const d = parseDate(dateStr);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (isNaN(d.getTime())) {
      return { day: dateStr, date: "" };
    }
    return {
      day: days[d.getDay()],
      date: `${d.getDate()} ${months[d.getMonth()]}.`,
    };
  };

  const getTotalStudents = (slot?: ExamSlot) => {
    if (!slot) return 0;
    const studentMap = new Map<string, Student>();
    slot.courses.forEach((c) => {
      c.students.forEach((s) => studentMap.set(s.student_code, s));
    });
    return studentMap.size;
  };

  const getMergedCourses = (courses: Course[]) => {
    const map = new Map<number, Course>();

    courses.forEach((c) => {
      if (map.has(c.course_id)) {
        const existing = map.get(c.course_id)!;

        const studentMap = new Map<string, Student>();
        existing.students.forEach((s) => studentMap.set(s.student_code, s));
        c.students.forEach((s) => studentMap.set(s.student_code, s));

        existing.students = Array.from(studentMap.values());
      } else {
        map.set(c.course_id, { ...c, students: [...c.students] });
      }
    });

    return Array.from(map.values());
  };

  const handleCellClick = (slot?: ExamSlot) => {
    if (!slot) return;
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };


  if (loading) return <Spinner />;
  if (!reports.length) return <div className="text-center p-4">No data available</div>;

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div
        className="text-white px-6 py-5"
        style={{ backgroundColor: tableColors.primary }}
      >
        <h2 className="text-2xl font-bold">
          {type === "midterm" ? "Midterm" : "Final"} Schedule in {courseName || "undefined"} class
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `120px repeat(${dates.length || 1}, minmax(120px, 1fr))`,
              gridTemplateRows: `90px repeat(${times.length}, 160px)`,
            }}
          >
            <div
              className="text-white font-bold flex items-center justify-center p-4 border border-gray-200"
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
                  <div className="text-base mb-1" >
                    {header.day}
                  </div>
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
                    className="text-white font-bold flex flex-col items-center justify-center p-4 border border-gray-200 gap-1"
                    style={{ backgroundColor: tableColors.primary }}
                  >
                    <div>{start}</div>
                    <div>-</div>
                    <div>{end}</div>
                  </div>

                  {dates.map((date) => {
                    const slot = findSlot(date, time);
                    const count = getTotalStudents(slot);

                    return (
                      <div
                        key={`${date}-${time}`}
                        style={{ backgroundColor: getStudentBgColor(count) }}
                        className={
                          `flex items-center justify-center p-4 border border-gray-200 min-h-[80px]
                            ${count > 0 ? "cursor-pointer" : ""}`
                        }
                        onClick={() => count > 0 && handleCellClick(slot)}

                      >
                        {count > 0 ? (
                          <span className="font-bold text-gray-800">
                            {count} {count === 1 ? "person" : "persons"}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
            <Modal
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
            >
              {selectedSlot && (
                <div>
                  <div className="text-md font-bold mb-2">
                    {selectedSlot.date}. {selectedSlot.start_time} - {selectedSlot.end_time}
                  </div>
                  <Table
                    dataSource={getMergedCourses(selectedSlot.courses).map((c, idx) => ({
                      key: `${c.course_id}-${idx}`,
                      ...c,
                    }))}
                    columns={[
                      { title: "Course ID", dataIndex: "course_id", key: "course_id" },
                      { title: "Course Name", dataIndex: "course_name", key: "course_name" },
                      {
                        title: "Students",
                        key: "students",
                        render: (_text, record: Course) => record.students.length,
                      },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ScheduleTable;

