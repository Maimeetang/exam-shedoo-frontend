import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { columns as baseColumns } from "@/constant/table/professor/courseList";
import { TeachingCourse } from "@/types/professor/TeachingCourse";
import axios from "axios";
import Link from "next/link";
import { GreenButton } from "../Button";

interface Props {
  lecturer: string;
}

const ProfessorCourseList: React.FC<Props> = ({ lecturer }) => {
  const [data, setData] = useState<TeachingCourse[]>([]);
  const [mergeMode, setMergeMode] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    axios
      .get<TeachingCourse[]>(`/api/professors/courses?lecturer=${lecturer}`)
      .then((res) => {
        const uniqueCourses = [
          ...new Map(res.data.map((course) => [course.course_code, course])).values(),
        ];
        setData(uniqueCourses);
      })
      .catch((err) => console.error(err));
  }, [lecturer]);

  const toggleMergeMode = () => {
    setMergeMode(!mergeMode);
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div className="rounded-md overflow-hidden shadow-lg mx-5">
      <div className="bg-[#AD92B2] px-4 py-5 flex justify-between items-center">
        <h2 className="text-white text-2xl font-semibold">Course List</h2>
        <button
          onClick={toggleMergeMode}
          className="bg-white text-[#AD92B2] font-semibold text-md px-4 py-2 rounded cursor-pointer"
        >
          {mergeMode ? "Cancel Merge" : "Merge"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] bg-white">
          <Table<TeachingCourse>
            columns={baseColumns}
            dataSource={data}
            rowKey="course_id"
            pagination={false}
            rowSelection={mergeMode ? rowSelection : undefined}
            footer={() =>
              mergeMode && selectedRowKeys.length > 0 ? (
                <div className="p-2 flex justify-end gap-2 items-center">
                  <span>Selected: {selectedRowKeys.length}</span>
                  <Link
                    href={{
                      pathname: "/dashboard/professor/view_students",
                      query: {
                        ids: selectedRowKeys.join(","),
                        course_name: selectedRowKeys
                          .map((key) => data.find((c) => c.course_id === key)?.course_name)
                          .filter(Boolean)
                          .join("+ "),
                      },
                    }}
                  >
                    <GreenButton text="View Selected Students" />
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

export default ProfessorCourseList;
