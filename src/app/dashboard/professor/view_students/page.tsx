"use client";
import Navbar from "@/component/Navbar";
import StudentList from "@/component/professor_page/StudentList";
import Spinner from "@/component/Spinner";
import { useProfile } from "@/custom_hooks/use-profile";
import Layout, { Footer } from "antd/es/layout/layout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ViewStudentsContent: React.FC = () => {
  const { profile, error } = useProfile();
  const query = useSearchParams();
  const courseName = query.get("course_name"); // optional, just for display
  const courseIdsQuery = query.get("ids"); // comma-separated ids
  const courseIDs = courseIdsQuery ? courseIdsQuery.split(",") : [];

  if (error) return <div className="p-3">Error: {error.message}</div>;
  if (!profile) return <Spinner />;

  return (
    <Layout className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      <div className="flex flex-col flex-1 items-center justify-center p-10">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          {courseName || "Students"}
        </h1>
        <div className="w-full flex justify-center">
          <StudentList
            courseIDs={courseIDs}
            courseName={courseName || "undefined"}
          />
        </div>
      </div>
      <Footer style={{ textAlign: "center" }}>
        © 2025 Full Stack Group 10. All Rights Reserved.
      </Footer>
    </Layout>
  );
};

const ViewStudents = () => (
  <Suspense fallback={<Spinner />}>
    <ViewStudentsContent />
  </Suspense>
);

export default ViewStudents;
