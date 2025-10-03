"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Admin } from "@/types/admin/Admin";
import axios from "axios";

interface prop {
  setError: (error: string) => void;
}

export function AdminList({ setError }: prop) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState<string>("");

  useEffect(() => {
    getAdmins();
  }, []);

  function getAdmins() {
    axios
      .get<Admin[]>("/api/admin")
      .then((res) => {
        if (res.data) {
          setAdmins(res.data);
        }
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      });
  }

  function removeAdmin(accout: string) {
    axios
      .delete(`/api/admin/${accout}`)
      .then(() => getAdmins())
      .catch((err) => {
        setError(err.message || "Something went wrong");
      });
  }

  function addAdmin(account: string) {
    axios
      .post("/api/admin", { account })
      .then(() => {
        getAdmins();
        setNewAdmin("");
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      });
  }

  return (
    <div style={{ flex: 1.2, marginRight: 16 }}>
      <Table<Admin>
        pagination={false}
        dataSource={admins}
        rowKey="ID"
        columns={[
          {
            title: "no.",
            key: "no",
            render: (_, __, index) => index + 1,
            width: 50,
          },
          {
            title: "Account",
            key: "account",
            dataIndex: "Account",
          },
          {
            key: "action",
            render: (_, record) => (
              <Popconfirm
                title="Remove admin?"
                onConfirm={() => removeAdmin(record.Account)}
              >
                <Button type="link" icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ),
            width: 60,
            align: "center" as const,
          },
        ]}
      />
      <Space style={{ marginTop: 16 }}>
        <Input
          placeholder="New admin"
          value={newAdmin}
          onChange={(e) => setNewAdmin(e.target.value)}
          style={{ width: 140 }}
        />
        <Button
          className="!bg-[#F7A97B] !text-white hover:!bg-[#ed994b] focus:!bg-[#ed994b] border-none"
          type="primary"
          onClick={() => addAdmin(newAdmin)}
        >
          Add Admin
        </Button>
      </Space>
    </div>
  );
}
