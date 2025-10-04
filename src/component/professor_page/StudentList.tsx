import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EnrolledStudent } from "@/types/professor/EnrolledStudent";
import Link from "next/link";
import { BlueButton } from "../Button";

interface Props {
  courseIDs: string[];
  courseName?: string;
}

const StudentList: React.FC<Props> = ({ courseIDs, courseName }) => {
  const [data, setData] = useState<EnrolledStudent[]>([]);
  const [filteredData, setFilteredData] = useState<EnrolledStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!courseIDs || courseIDs.length === 0) return;

    const fetchAllStudents = async () => {
      try {
        const requests = courseIDs.map((id) =>
          axios
            .get<EnrolledStudent[]>(
              `/api/professors/courses/enrolled_students/${id}`
            )
            .then((res) => res.data)
            .catch((err) => {
              console.warn(`Failed to fetch course ${id}: ${err.message}`);
              return [];
            })
        );

        const allStudentsArrays = await Promise.all(requests);
        const allStudents = allStudentsArrays.flat();

        const uniqueStudents = [
          ...new Map(allStudents.map((s) => [s.student_code, s])).values(),
        ];

        setData(uniqueStudents);
        setFilteredData(uniqueStudents);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllStudents();
  }, [courseIDs]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = data.filter((student) =>
      student.student_code.includes(value)
    );
    setFilteredData(filtered);
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

        {/* Table */}
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

