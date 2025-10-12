import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Table, Progress } from "antd";
import { columns } from "@/constant/table/student/courseList";
import { EnrolledCourse } from "@/types/student/EnrolledCourse";
import axios from "axios";
import { Term } from "@/types/student/Terms";
import { useQuery } from "@tanstack/react-query";

interface Props {
  studentID: string;
  setTerm: Dispatch<SetStateAction<Term>>;
}

const StudentCourseList: React.FC<Props> = ({ studentID, setTerm }) => {
  const { data = [] } = useQuery({
    queryKey: ['student-enrollments', studentID],
    queryFn: async () => {
      const res = await axios.get<EnrolledCourse[]>(
        `/api/students/enrollments/${studentID}`
      );
      return res.data;
    },
    enabled: !!studentID,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data.length > 0) {
      setTerm({ semester: data[0].semester, year: data[0].year });
    }
  }, [data, setTerm]);

  function creditSum() {
    return data.reduce(
      (sum, course) => sum + course.lab_credit + course.lec_credit,
      0
    );
  }
  return (
    <>
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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
      <div className="flex max-w-7xl flex-col mx-auto my-10 center">
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
