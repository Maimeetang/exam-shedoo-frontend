import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { Enrollment } from "@/types/Enrollment";
import axios from "axios";

const columns: TableProps<Enrollment>["columns"] = [
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
    title: "Credit",
    dataIndex: "credit",
    key: "credit",
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
    render: (_, { start_time, end_time }) => (
      <>{`${start_time} - ${end_time}`}</>
    ),
  },
];

interface Props {
  studentID: string;
}

const StudentCourseList: React.FC<Props> = ({ studentID }) => {
  const [data, setData] = useState<Enrollment[]>([]);

  useEffect(() => {
    axios
      .get<Enrollment[]>(`/api/students/enrollments/${studentID}`)
      .then((res) => {
        setData(res.data);
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
      <div className="overflow-x-auto">
        <div className="min-w-[800px] bg-white">
          <Table<Enrollment>
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            footer={() => <div className="p-2"></div>}
          />
        </div>
      </div>
    </div>
  );

  //   return (
  //     <div className="p-3">
  //       <pre>{JSON.stringify(data, null, 2)}</pre>
  //     </div>
  //   );
};

export default StudentCourseList;
