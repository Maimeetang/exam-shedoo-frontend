"use client";
import Navbar from "@/component/Navbar";
import ScheduleTable from "@/component/professor_page/ShedulesTable";
import Spinner from "@/component/Spinner";
import { useProfile } from "@/custom_hooks/use-profile";
import Layout, { Footer } from "antd/es/layout/layout";
import { useSearchParams } from "next/navigation";

const ExamSchedules: React.FC = () => {
  const { profile, error } = useProfile();
  const query = useSearchParams();

  const courseIdsQuery = query.get("ids");
  const courseIDs = courseIdsQuery ? courseIdsQuery.split(",") : [];
  const courseName = query.get("course_name");


  if (error) return <div className="p-3">Error: {error.message}</div>;
  if (!profile) return <Spinner />;

  return (
    <Layout className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      <div className="flex flex-col flex-1 items-center justify-center p-10">
        <div className="w-full flex flex-col items-center gap-12">
          <ScheduleTable courseIds={courseIDs} courseName={courseName || "undefined"} type="midterm" />
          <ScheduleTable courseIds={courseIDs} courseName={courseName || "undefined"} type="final" />
        </div>
      </div>
      <Footer style={{ textAlign: "center" }}>
        © 2025 Full Stack Group 10. All Rights Reserved.
      </Footer>
    </Layout>
  );
};

export default ExamSchedules;

