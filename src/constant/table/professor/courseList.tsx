import type { TableProps } from "antd";
import { TeachingCourse } from "@/types/professor/TeachingCourse";
import { formatDate, formatTimeRange } from "@/utils/date";

export const columns: TableProps<TeachingCourse>["columns"] = [
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
    title: "Mideterm Exam",
    children: [
      {
        title: "Date",
        key: "mid_date",
        render: (_, { midterm_date }) => formatDate(midterm_date),
      },
      {
        title: "Time",
        key: "mid_time",
        render: (_, { midterm_start_time, midterm_end_time }) =>
          formatTimeRange(midterm_start_time, midterm_end_time),
      },
    ],
  },
  {
    title: "Final exam",
    children: [
      {
        title: "Date",
        key: "final_date",
        render: (_, { final_date }) => formatDate(final_date),
      },
      {
        title: "Time",
        key: "final_date",
        render: (_, { final_start_time, final_end_time }) =>
          formatTimeRange(final_start_time, final_end_time),
      },
    ],
  },
  {
    title: "",
    key: "edit",
    render: () => (
      <img
        src="/buttons/Edit-Exam-date.png"
        alt="edit"
        className="w-30 cursor-pointer"
      />
    ),
  },
  {
    title: "",
    key: "view",
    render: () => (
      <img
        src="/buttons/View-Student.png"
        alt="view"
        className="w-30 cursor-pointer"
      />
    ),
  },
];
