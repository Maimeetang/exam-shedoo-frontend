import React, { useEffect, useState } from "react";
import { Table, Progress } from "antd";
import { columns } from "@/constant/table/student/courseList";
import { EnrolledCourse } from "@/types/student/EnrolledCourse";
import axios from "axios";

interface Props {
  studentID: string;
}

const StudentCourseList: React.FC<Props> = ({ studentID }) => {
  const [data, setData] = useState<EnrolledCourse[]>([]);

  useEffect(() => {
    axios
      .get<EnrolledCourse[]>(`/api/students/enrollments/${studentID}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [studentID]);

  function creditSum() {
    return data.reduce((sum, course) => sum + course.credit, 0);
  }

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
            <Table<EnrolledCourse>
              columns={columns}
              dataSource={data}
              rowKey="id"
              pagination={false}
              footer={() => <div className="p-2"></div>}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-5 my-10">
        <p>Enrolled: {creditSum()} / 21</p>
        <Progress
          percent={Math.floor((creditSum() / 21) * 100)}
          percentPosition={{ align: "end", type: "outer" }}
          strokeColor="#8EAE96"
        />
      </div>
    </>
  );
};

export default StudentCourseList;
