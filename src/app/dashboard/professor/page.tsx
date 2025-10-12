"use client";
import Navbar from "@/component/Navbar";
import Spinner from "@/component/Spinner";
import { Layout } from "antd";
import ProfessorCourseList from "@/component/dashboard/ProfessorCourseList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProfile } from "@/custom_hooks/use-profile";


const { Content, Footer } = Layout;

const ProfessorDashboard: React.FC = () => {
  const { profile, error } = useProfile();


  if (error) {
    return <div className="p-3">Error: {error.message}</div>;
  }

  if (!profile) return <Spinner />;

  return (
    <Layout className="flex flex-col min-h-screen">
      <QueryClientProvider client={new QueryClient()}>
        <Navbar profile={profile} />

        <Content className="flex-1 p-6">
          {/* Test */}
          <ProfessorCourseList lecturer={profile.firstname_TH + "  " + profile.lastname_TH} />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          © 2025 Full Stack Group 10. All Rights Reserved.
        </Footer>
      </QueryClientProvider>
    </Layout>
  );
};

export default ProfessorDashboard;
