import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { columns } from "@/constant/table/professor/courseList";
import { TeachingCourse } from "@/types/professor/TeachingCourse";
import axios from "axios";

interface Props {
  lecturer: string;
}

const ProfessorCourseList: React.FC<Props> = ({ lecturer }) => {
  const [data, setData] = useState<TeachingCourse[]>([]);

  useEffect(() => {
    axios
      .get<TeachingCourse[]>(`/api/professors/courses?lecturer=${lecturer}`)
      .then((res) => {
        const uniqueCourses = [
          ...new Map(
            res.data.map((course) => [course.course_code, course])
          ).values(),
        ];
        setData(uniqueCourses);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [lecturer]);

  //   return (
  //     <div className="p-3">
  //       <pre>{JSON.stringify(data, null, 2)}</pre>
  //     </div>
  //   );

  return (
    <>
      <div className="rounded-md overflow-hidden shadow-lg mx-5">
        <div className="bg-[#AD92B2] px-4 py-5">
          <h2 className="text-white text-2xl font-semibold">Course List</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[800px] bg-white">
            <Table<TeachingCourse>
              columns={columns}
              dataSource={data}
              rowKey="course_id"
              pagination={false}
              footer={() => <div className="p-2"></div>}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessorCourseList;
