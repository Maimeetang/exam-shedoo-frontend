"use client";
import "@ant-design/v5-patch-for-react-19";
import { Layout, Typography, Divider } from "antd";
import Spinner from "@/component/Spinner";
import { AdminList } from "@/component/dashboard/admin/AdminList";
import Navbar from "@/component/Navbar";
import SetupSystem from "@/component/dashboard/admin/SetupSystem";
import { useProfile } from "@/custom_hooks/use-profile";
import { useState } from "react";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const { profile, error } = useProfile();
  const [_, setError] = useState<string>("");

  if (error) {
    return <div className="p-3">Error: {error.message}</div>;
  }

  if (!profile) return <Spinner />;

  return (
    <Layout className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      <Content className="flex-1 p-6">
        <Header
          style={{
            background: "#aa94b7",
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "16px 32px",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <Title level={3} style={{ flex: 1, margin: 0 }}>
            Admin List
          </Title>
          <Divider type="vertical" style={{ height: 40 }} />
          <Title level={3} style={{ flex: 2, textAlign: "start", margin: 0 }}>
            Set up System
          </Title>
        </Header>
        <Content
          style={{
            display: "flex",
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            padding: 16,
            overflow: "auto",
          }}
        >
          <AdminList setError={setError} />
          <SetupSystem setError={setError} />
        </Content>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        © 2025 Full Stack Group 10. All Rights Reserved.
      </Footer>
    </Layout>
  );
};

export default AdminDashboard;
