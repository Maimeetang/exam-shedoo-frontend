import React from "react";
import { Table } from "antd";
import { getColumns } from "@/constant/table/professor/courseList";
import { TeachingCourse } from "@/types/professor/TeachingCourse";
import Link from "next/link";
import { GreenButton } from "../Button";
import "@ant-design/v5-patch-for-react-19";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { coursesAtom, mergeModeAtom, selectedRowKeysAtom } from "@/atoms/ProfessorCourseList";


interface Props {
  lecturer: string;
}

const ProfessorCourseList: React.FC<Props> = ({ lecturer }) => {
  const [courses, setCourses] = useAtom(coursesAtom);
  const [mergeMode, setMergeMode] = useAtom(mergeModeAtom);
  const [selectedRowKeys, setSelectedRowKeys] = useAtom(selectedRowKeysAtom);

  const fetchCourses = async (lecturer: string): Promise<TeachingCourse[]> => {
    const res = await fetch(`/api/professors/courses?lecturer=${lecturer}`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    const data: TeachingCourse[] = await res.json();
    setCourses(data);
    return data;
  };

  const { isLoading, error } = useQuery<TeachingCourse[], Error>({
    queryKey: ["courses", lecturer],
    queryFn: () => fetchCourses(lecturer),
    refetchOnWindowFocus: false,
  });

  const toggleMergeMode = () => {
    setMergeMode(!mergeMode);
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            columns={getColumns()} // ExamModal now reads coursesAtom directly
            dataSource={courses}
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
                          .map(
                            (key) =>
                              courses.find((c) => c.course_id === key)?.course_name
                          )
                          .filter(Boolean)
                          .join(" and "),
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
