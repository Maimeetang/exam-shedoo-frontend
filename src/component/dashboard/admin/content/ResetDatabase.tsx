import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Status } from "@/types/admin/ScrapeJob";

interface Props {
  status: Status;
  setStatus: (status: Status) => void;
}

const DeleteDatabaseButton = ({ status, setStatus }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const VERIFY_TEXT = "reset database";

  const handleDelete = async () => {
    try {
      setLoading(true);
      setStatus("running");

      const response = await axios.delete("/api/admin/data/all");

      message.success(response.data?.message || "Database deleted successfully");
      setStatus("completed");
      setIsModalOpen(false);
      setConfirmationText("");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete database");
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() => setIsModalOpen(true)}
        disabled={status === "running"}
      >
        Delete Database
      </Button>

      <Modal
        title={
          <span>
            <ExclamationCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
            Confirm Database Deletion
          </span>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setConfirmationText("");
        }}
        okText="Delete"
        okButtonProps={{
          danger: true,
          disabled: confirmationText !== VERIFY_TEXT || loading,
          loading,
        }}
        onOk={handleDelete}
      >
        <p>
          This action will permanently delete <b>all data</b> except admin from the database.
          Please type <b>reset database</b> to confirm.
        </p>
        <Input
          placeholder={`Type ${VERIFY_TEXT} to confirm`}
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default DeleteDatabaseButton;
