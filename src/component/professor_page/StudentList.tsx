"use client";

import React, { useState, useMemo } from "react";
import { Table, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EnrolledStudent } from "@/types/professor/EnrolledStudent";
import Link from "next/link";
import { BlueButton } from "../Button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  courseIDs: string[];
  courseName?: string;
}

const StudentList: React.FC<Props> = ({ courseIDs, courseName }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: students = [], isLoading, error } = useQuery<EnrolledStudent[], Error>({
    queryKey: ["students", courseIDs],
    queryFn: async () => {
      if (!courseIDs || courseIDs.length === 0) return [];
      const requests = courseIDs.map((id) =>
        axios
          .get<EnrolledStudent[]>(`/api/professors/courses/enrolled_students/${id}`)
          .then((res) => res.data)
          .catch(() => [])
      );
      const allArrays = await Promise.all(requests);
      const allStudents = allArrays.flat();

      // Deduplicate by student_code
      return [...new Map(allStudents.map((s) => [s.student_code, s])).values()];
    },
    refetchOnWindowFocus: false,
    enabled: courseIDs.length > 0,
  });

  const filteredData: EnrolledStudent[] = useMemo(() => {
    return students.filter((student: EnrolledStudent) =>
      student.student_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const columns: ColumnsType<EnrolledStudent> = [
    {
      title: "No.",
      key: "no",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Student ID",
      dataIndex: "student_code",
      key: "student_code",
    },
  ];

  if (isLoading) return <div>Loading students...</div>;
  if (error) return <div className="p-3">Error: {error.message}</div>;

  return (
    <div className="flex justify-center w-full mt-10">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Input.Search
            placeholder="Search by Student ID"
            allowClear
            enterButton
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
          />
        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="enrollment_id"
            bordered={false}
            className="ant-table-bordered ant-table-striped"
            rowClassName={() => "border-b border-gray-200"}
            pagination={false}
            scroll={{ y: 400 }}
            footer={() =>
              courseIDs.length > 0 ? (
                <div className="flex justify-end p-2">
                  <Link
                    href={{
                      pathname: "/dashboard/professor/shedules",
                      query: {
                        ids: courseIDs.join(","),
                        course_name: courseName,
                      },
                    }}
                  >
                    <BlueButton text="Schedule Student" />
                  </Link>
                </div>
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StudentList;

