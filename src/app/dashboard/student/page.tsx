"use client";
import Navbar from "@/component/Navbar";
import Spinner from "@/component/Spinner";
import { Profile } from "@/types/Profile";
import axios from "axios";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import StudentCourseList from "@/component/dashboard/StudentCourseList";
import StudentClassSchedule from "@/component/dashboard/StudentClassSchedule";

const { Content, Footer } = Layout;

const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Profile>("/api/auth/profile")
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      });
  }, []);

  if (error) {
    return <div className="p-3">Error: {error}</div>;
  }

  if (!profile) return <Spinner />;

  return (
    <Layout className="flex flex-col min-h-screen">
      <Navbar profile={profile} />

      <Content className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-2 mt-15 text-center">
          Schedule Management online
        </h1>
        <h1 className="text-3xl font-semibold mb-15 text-center">
          Academic Year X/XXXX
        </h1>
        <StudentCourseList studentID={profile.student_id} />
        <StudentClassSchedule studentID={profile.student_id} />
      </Content>

      <Footer style={{ textAlign: "center" }}>
        © 2025 Full Stack Group 10. All Rights Reserved.
      </Footer>
    </Layout>
  );
};

export default StudentDashboard;
