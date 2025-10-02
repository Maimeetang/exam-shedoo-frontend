"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { EnrolledCourse } from "@/types/student/EnrolledCourse";
import { formatTimeRange } from "@/utils/date";
import { dayColors } from "@/types/Colorday";

const dayMap: Record<string, string> = {
  M: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  F: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

const courseColorMap = new Map<string, string>();

const getRandomUnusedDayColor = () => {
  // ดึงสีที่ใช้ไปแล้ว
  const usedColors = new Set(courseColorMap.values());
  // filter สีที่ยังไม่ถูกใช้
  const unusedColors = Object.values(dayColors).filter(
    (c) => !usedColors.has(c)
  );

  // ถ้าหมดแล้ว ให้กลับไปใช้ random ปกติ
  if (unusedColors.length === 0) {
    return Object.values(dayColors)[
      Math.floor(Math.random() * Object.values(dayColors).length)
    ];
  }

  // เลือกสีจาก unusedColors
  return unusedColors[Math.floor(Math.random() * unusedColors.length)];
};

const getCourseColor = (courseId: string | number) => {
  const key = courseId.toString();
  if (!courseColorMap.has(key)) {
    courseColorMap.set(key, getRandomUnusedDayColor());
  }
  return courseColorMap.get(key)!;
};

const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 08:00 - 17:00

interface Props {
  studentID: string;
}

const StudentClassSchedule: React.FC<Props> = ({ studentID }) => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);

  useEffect(() => {
    axios
      .get<EnrolledCourse[]>(`/api/students/enrollments/${studentID}`)
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [studentID]);

  return (
    <div className="rounded-md overflow-hidden shadow-lg mx-5">
      <div className="bg-[#AD92B2] px-4 py-5">
        <h2 className="text-white text-2xl font-semibold">Course List</h2>
      </div>

      <div className="mt-4 grid grid-cols-[120px_repeat(10,1fr)] rounded-lg overflow-hidden ">
        {/* Header */}
        <div className="p-2 font-semibold text-center"> </div>
        {hours.map((h) => (
          <div key={h} className="p-2 text-center text-sm">
            {h.toString().padStart(2, "0")}:00
          </div>
        ))}

        {/* Rows */}
        {Object.entries(dayMap).map(([abbr, full]) => (
          <React.Fragment key={abbr}>
            {/* Day column */}
            <div
              className="bg-slate-700 p-2 font-semibold flex flex-col items-center justify-center"
              style={{ color: dayColors[abbr] }}
            >
              {full}
            </div>

            {/* Time slots */}
            <div className="col-span-10 relative border-l border-t h-24 text-center">
              {courses
                .filter((c) => c.days.includes(abbr))
                .map((course) => {
                  const startHour = parseInt(course.start_time.substring(0, 2));
                  const startMin = parseInt(course.start_time.substring(2, 4));
                  const endHour = parseInt(course.end_time.substring(0, 2));
                  const endMin = parseInt(course.end_time.substring(2, 4));

                  const start = (startHour - 8) * 60 + startMin;
                  const end = (endHour - 8) * 60 + endMin;
                  const total = 10 * 60;
                  const left = `${(start / total) * 100}%`;
                  const width = `${((end - start) / total) * 100}%`;

                  return (
                    <div
                      key={course.id}
                      className="absolute top-0 bottom-0 rounded-lg text-xs p-2 text-black shadow flex flex-col items-center justify-center"
                      style={{
                        left,
                        width,
                        backgroundColor: getCourseColor(course.id),
                      }}
                    >
                      <div className="font-bold">{course.course_code}</div>
                      <div className="font-bold">{course.course_name}</div>
                      <div className="font-bold">
                        sec. {course.lec_section} | Room {course.room || "-"}
                      </div>
                      <div className="font-bold">
                        {formatTimeRange(course.start_time, course.end_time)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StudentClassSchedule;
