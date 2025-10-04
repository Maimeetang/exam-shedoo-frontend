"use client";
import Navbar from "@/component/Navbar";
import ScheduleTable from "@/component/professor_page/ShedulesTable";
import Spinner from "@/component/Spinner";
import { Profile } from "@/types/Profile";
import Layout, { Footer } from "antd/es/layout/layout";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ExamSchedules: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const query = useSearchParams();

  const courseName = query.get("course_name"); // optional, just for display
  const courseIdsQuery = query.get("ids"); // comma-separated ids from URL
  const courseIDs = courseIdsQuery ? courseIdsQuery.split(",") : [];

  useEffect(() => {
    axios
      .get<Profile>("/api/auth/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message || "Something went wrong"));
  }, []);

  if (error) return <div className="p-3">Error: {error}</div>;
  if (!profile) return <Spinner />;

  return (
    <Layout className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      <div className="flex flex-col flex-1 items-center justify-center p-10">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          {courseName || "Students"}
        </h1>
        <div className="w-full flex justify-center">
          {/* Pass courseIDs from query to ScheduleTable */}
          <ScheduleTable courseIds={courseIDs} type="midterm" />
        </div>
      </div>
      <Footer style={{ textAlign: "center" }}>
        © 2025 Full Stack Group 10. All Rights Reserved.
      </Footer>
    </Layout>
  );
};

export default ExamSchedules;

