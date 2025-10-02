"use client";
import Navbar from "@/component/Navbar";
import Spinner from "@/component/Spinner";
import { Profile } from "@/types/Profile";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import ProfessorCourseList from "@/component/dashboard/ProfessorCourseList";

const { Content, Footer } = Layout;

const ProfessorDashboard: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Profile>("/api/auth/profile")
      .then((res) => {
        setProfile(res.data);
        console.log(res.data.cmuitaccount_name);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Something went wrong");
        }
      });
  }, []);

  if (error) {
    return <div className="p-3">Error: {error}</div>;
  }

  if (!profile) return <Spinner />;

  return (
    <Layout className="flex flex-col min-h-screen">
      <Navbar userName={`${profile.firstname_EN} ${profile.lastname_EN}`} />

      <Content className="flex-1 p-6">
        {/* Test */}
        <ProfessorCourseList lecturer={"ชินวัตร  อิศราดิสัยกุล"} />
        {/* <ProfessorCourseList lecturer={profile.cmuitaccount_name} /> */}
      </Content>

      <Footer style={{ textAlign: "center" }}>
        © 2025 Full Stack Group 10. All Rights Reserved.
      </Footer>
    </Layout>
  );
};

export default ProfessorDashboard;
