"use client";
import React, { useMemo, useState } from "react";
import axios from "axios";
import Spinner from "../Spinner";
import { tableColors } from "@/types/Color";
import { getHeaderTextColor, getStudentBgColor } from "@/utils/color";
import { parseDate } from "@/utils/date";
import { Modal, Table } from "antd";
import { useQuery } from "@tanstack/react-query";

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

const ScheduleTable: React.FC<Props> = ({
  courseIds,
  courseName,
  type = "midterm",
}) => {
  const [selectedSlot, setSelectedSlot] = useState<ExamSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: reports = [], isLoading } = useQuery<ExamReport[], Error>({
    queryKey: ["examReports", courseIds],
    queryFn: async () => {
      if (!courseIds || courseIds.length === 0) return [];
      const responses = await Promise.all(
        courseIds.map((id) =>
          axios
            .get<ExamReport>(`/api/professors/course_exams/report/${id}`)
            .then((res) => res.data)
        )
      );
      return responses;
    },
    enabled: courseIds.length > 0,
    refetchOnWindowFocus: false,
  });

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
            existingCourse.students.forEach((s) =>
              studentMap.set(s.student_code, s)
            );
            c.students.forEach((s) => studentMap.set(s.student_code, s));
            existingCourse.students = Array.from(studentMap.values());
          } else {
            existing.courses.push({ ...c, students: [...c.students] });
          }
        });
      } else {
        map.set(key, {
          date,
          start_time: start,
          end_time: end,
          courses: slot.courses.map((c) => ({
            ...c,
            students: [...c.students],
          })),
        });
      }
    });

    return Array.from(map.values());
  }, [allSlots]);

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
    }
    return arr;
  }, [mergedSlots]);

  const hoursRange = useMemo(() => {
    const hours = mergedSlots.map((s) => {
      const startH = parseInt(s.start_time.slice(0, 2), 10);
      const endH = parseInt(s.end_time.slice(0, 2), 10);
      return [startH, endH];
    });

    let minHour = 8;
    let maxHour = 19;

    hours.forEach(([start, end]) => {
      if (start < minHour) minHour = start;
      if (end > maxHour) maxHour = end;
    });

    return { minHour, maxHour };
  }, [mergedSlots]);

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

  const getTotalStudents = (slot?: ExamSlot | null) => {
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

  const handleCellClick = (slot: ExamSlot | null) => {
    if (!slot) return;
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  if (isLoading) return <Spinner />;
  if (!reports.length)
    return <div className="text-center p-4">No data available</div>;

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div
        className="text-white px-6 py-5"
        style={{ backgroundColor: tableColors.primary }}
      >
        <h2 className="text-2xl font-bold">
          {type === "midterm" ? "Midterm" : "Final"} Schedule in{" "}
          {courseName || "undefined"} class
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

          {/* Exams overlay */}
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
              {dates.map((date, dateIdx) => {
                const dailySlots = mergedSlots.filter(
                  (s) =>
                    parseDate(s.date).getTime() === parseDate(date).getTime()
                );

                return (
                  <div key={`col-${dateIdx}`} className="relative">
                    {dailySlots.map((slot, slotIdx) => {
                      const startH = parseInt(slot.start_time.slice(0, 2), 10);
                      const startM = parseInt(slot.start_time.slice(2, 4), 10);
                      const endH = parseInt(slot.end_time.slice(0, 2), 10);
                      const endM = parseInt(slot.end_time.slice(2, 4), 10);

                      // Convert time to Y position (pixels)
                      const HEADER_HEIGHT = 80;
                      const startY =
                        HEADER_HEIGHT +
                        (startH - hoursRange.minHour + startM / 60) * 80;
                      const endY =
                        HEADER_HEIGHT +
                        (endH - hoursRange.minHour + endM / 60) * 80;
                      const height = Math.max(endY - startY, 40);

                      const count = getTotalStudents(slot);

                      return (
                        <div
                          key={`exam-${dateIdx}-${slotIdx}`}
                          className={`absolute left-1 right-1 text-xs p-2 text-[#303030] shadow flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-150 ease-in-out z-[${slotIdx}] hover:z-[9999]`}
                          style={{
                            top: startY,
                            height,
                            backgroundColor: getStudentBgColor(count) + "99",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.backgroundColor = getStudentBgColor(count);
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.backgroundColor =
                              getStudentBgColor(count) + "99";
                          }}
                          onClick={() => handleCellClick(slot)}
                        >
                          <div className="font-bold text-[16px] mt-1">
                            {count} students
                          </div>
                          <div className="text-[14px]">{`${slot.start_time}-${slot.end_time}`}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedSlot && (
          <div>
            <div className="text-md font-bold mb-2">
              {selectedSlot.date}. {selectedSlot.start_time} -{" "}
              {selectedSlot.end_time}
            </div>
            <Table
              dataSource={getMergedCourses(selectedSlot.courses).map(
                (c, idx) => ({
                  key: `${c.course_id}-${idx}`,
                  ...c,
                })
              )}
              columns={[
                {
                  title: "Course ID",
                  dataIndex: "course_id",
                  key: "course_id",
                },
                {
                  title: "Course Name",
                  dataIndex: "course_name",
                  key: "course_name",
                },
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
  );
};

export default ScheduleTable;
