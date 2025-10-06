import type { TableProps } from "antd";
import { EnrolledCourse } from "@/types/student/EnrolledCourse";
import { formatTimeRange } from "@/utils/date";

export const columns: TableProps<EnrolledCourse>["columns"] = [
  {
    title: "No.",
    key: "no",
    render: (_, __, index) => index + 1, // แสดงลำดับ
  },
  {
    title: "CourseID",
    dataIndex: "course_code",
    key: "course_code",
  },
  {
    title: "Course Name",
    dataIndex: "course_name",
    key: "course_name",
  },
  {
    title: "Sec.",
    key: "sec",
    render: (_, record) => {
      const sections = [record.lec_section, record.lab_section].filter(
        (sec) => sec !== "000"
      );
      return sections.join(" / ");
    },
  },
  {
    title: "Lec Credit",
    key: "lec_credit",
    render: (_, record) =>
      record.lec_credit,
  },
  {
    title: "Lab Credit",
    key: "lab_credit",
    render: (_, record) =>
      record.lab_credit,
  },
  {
    title: "Instructors",
    key: "instructors",
    render: (_, { instructors }) => (
      <>
        {instructors.map((instructor, index) => (
          <p key={index}>{instructor.name}</p>
        ))}
      </>
    ),
  },
  {
    title: "Room",
    dataIndex: "room",
    key: "room",
  },
  {
    title: "Day",
    dataIndex: "days",
    key: "days",
  },
  {
    title: "Time",
    key: "time",
    render: (_, { start_time, end_time }) =>
      formatTimeRange(start_time, end_time),
  },
];
