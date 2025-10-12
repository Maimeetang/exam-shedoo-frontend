"use client";

import React, { useRef } from "react";
import ExportButton from "@/component/dashboard/ExportButton";
import "@ant-design/v5-patch-for-react-19";
import axios from "axios";
import { EnrolledCourse } from "@/types/student/EnrolledCourse";
import { formatTimeRange } from "@/utils/date";
import { dayColors } from "@/types/Color";
import { useQuery } from '@tanstack/react-query';


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
  const usedColors = new Set(courseColorMap.values());

  const unusedColors = Object.values(dayColors).filter(
    (c) => !usedColors.has(c)
  );

  if (unusedColors.length === 0) {
    return Object.values(dayColors)[
      Math.floor(Math.random() * Object.values(dayColors).length)
    ];
  }

  return unusedColors[Math.floor(Math.random() * unusedColors.length)];
};

const getCourseColor = (courseId: number) => {
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
  const { data: courses = [] } = useQuery({
    queryKey: ['student-enrollments', studentID],
    queryFn: async () => {
      const res = await axios.get<EnrolledCourse[]>(
        `/api/students/enrollments/${studentID}`
      );
      return res.data;
    },
    enabled: !!studentID,
    refetchOnWindowFocus: false,
  });

  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div ref={tableRef}>
        <div className="bg-[#AD92B2] px-4 py-5">
          <h2 className="text-white text-2xl font-semibold">ClassSchedule</h2>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div
            className="grid grid-cols-[120px_repeat(10,1fr)] min-w-[1200px] rounded-lg overflow-hidden"
            style={{
              gridTemplateColumns: `120px repeat(${hours.length}, 1fr)`,
            }}
          >
            {/* Header */}
            <div className="p-2 font-semibold text-center"> </div>
            {hours.map((h, i) => (
              <div
                key={h}
                className={`p-2 text-center text-sm whitespace-nowrap ${i > 0 ? "border-l" : ""
                  } border-gray-400`}
              >
                {h.toString().padStart(2, "0")}:00
              </div>
            ))}

            {/* Rows */}
            {Object.entries(dayMap).map(([abbr, full]) => (
              <React.Fragment key={abbr}>
                <div
                  className="bg-slate-700 p-2 font-semibold flex flex-col items-center justify-center"
                  style={{ color: dayColors[abbr] }}
                >
                  {full}
                </div>

                <div className="col-span-10 relative border-l border-gray-400 border-t h-24 text-center">
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
                          className="absolute top-0 bottom-0 rounded-lg text-[14px] p-2 text-[#303030] shadow flex flex-col items-center justify-center overflow-hidden"
                          style={{
                            left,
                            width,
                            backgroundColor: getCourseColor(course.id),
                          }}
                        >
                          <div className="font-bold w-full text-center text-[16px] truncate">
                            {course.course_code}
                          </div>
                          <div className="w-full text-center truncate">{course.course_name}</div>
                          <div className="w-full text-center truncate">
                            {course.lec_section} | Room {course.room || "-"}
                          </div>
                          <div className="w-full text-center truncate">
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

      </div>
      <div className="flex justify-end px-4 py-2 rounded-b-md">
        <ExportButton
          targetRef={tableRef as React.RefObject<HTMLElement>}
          fileName={`course_schedule_${studentID}.png`}
        />
      </div>
    </div>
  );
};

export default StudentClassSchedule;
