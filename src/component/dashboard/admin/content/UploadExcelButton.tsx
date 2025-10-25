import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";
import { Status } from "@/types/admin/ScrapeJob";

interface prop {
  status: Status;
  prevTaskStatus: Status;
  setStatus: (status: Status) => void;
}

const UploadExcelButton = ({ status, setStatus }: prop) => {
  const props: UploadProps = {
    name: "file",
    action: "/api/admin/enrollments/upload",
    beforeUpload(file) {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        message.error("อนุญาตเฉพาะไฟล์ .xlsx เท่านั้น");
      }
      return isExcel || Upload.LIST_IGNORE; // ถ้าไม่ใช่ .xlsx จะไม่ถูกเพิ่มใน list และไม่อัปโหลด
    },
    onChange(info) {
      if (info.file.status === "done") {
        setStatus("completed");
        message.success(`${info.file.response.message}`);
      } else if (info.file.status === "error") {
        setStatus("failed");
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <Upload
      {...props}
      disabled={(status !== "waiting" && status !== "failed")}

    >
      <Button
        icon={<UploadOutlined />}
        disabled={(status !== "waiting" && status !== "failed")}
      >
        Click to Upload
      </Button>
    </Upload>
  );
};

export default UploadExcelButton;
