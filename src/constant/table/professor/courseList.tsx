// courseList.ts
import type { TableProps } from "antd";
import { TeachingCourse } from "@/types/professor/TeachingCourse";
import { formatDate, formatTimeRange } from "@/utils/date";
import { GreenButton } from "@/component/Button";
import Link from "next/link";
import ExamModal from "@/component/ExamModal";

export const getColumns = (
  onExamUpdate: (updated: TeachingCourse) => void
): TableProps<TeachingCourse>["columns"] => [
    {
      title: "No.",
      key: "no",
      render: (_, __, index) => index + 1,
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
      title: "Lec Section",
      dataIndex: "lec_section",
      key: "lec_section",
    },
    {
      title: "Lab Section",
      dataIndex: "lab_section",
      key: "lab_section",
    },
    {
      title: "Midterm Exam",
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
      title: "Final Exam",
      children: [
        {
          title: "Date",
          key: "final_date",
          render: (_, { final_date }) => formatDate(final_date),
        },
        {
          title: "Time",
          key: "final_time",
          render: (_, { final_start_time, final_end_time }) =>
            formatTimeRange(final_start_time, final_end_time),
        },
      ],
    },
    {
      title: "",
      key: "edit",
      width: 160,
      render: (_: any, record: TeachingCourse) => (
        <ExamModal record={record} onExamUpdate={onExamUpdate} />
      ),
    },
    {
      title: "",
      key: "view",
      width: 150,
      render: (_: any, record: TeachingCourse) => (
        <Link
          href={{
            pathname: `/dashboard/professor/view_students`,
            query: {
              ids: record.course_id,
              course_name: record.course_name,
              course_section: record.lec_section,
            },
          }}
        >
          <GreenButton text="View Student" />
        </Link>
      ),
    },
  ];

