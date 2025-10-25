import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, RcFile } from "antd/es/upload";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { Button, message, Select, Upload } from "antd";
import axios from "axios";
import { Status } from "@/types/admin/ScrapeJob";

const { Option } = Select;

interface prop {
  status: Status;
  prevTaskStatus: Status;
  setStatus: (status: Status) => void;
}

const UploadPdf = ({ status, setStatus }: prop) => {
  const [examType, setExamType] = useState<"MIDTERM" | "FINAL">("MIDTERM");

  const customRequest = async (options: RcCustomRequestOptions) => {
    const { file, onSuccess, onError, onProgress } = options;
    const formData = new FormData();
    formData.append("file", file as RcFile);
    formData.append("exam_type", examType); // ใส่ exam_type ไปด้วย

    try {
      const res = await axios.post("/api/admin/exampdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          setStatus("running");
          const percent = Math.round((event.loaded * 100) / (event.total ?? 1));
          onProgress?.({ percent });
        },
      });
      setStatus("completed");
      onSuccess?.(res.data);
      message.success(res.data.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError?.(err);
        setStatus("failed");
        message.error(`${(file as RcFile).name} upload failed`);
      } else {
        message.error("Something went wrong");
      }
    }
  };

  const props: UploadProps = {
    customRequest,
    beforeUpload(file) {
      const isExcel = file.type === "application/pdf";
      if (!isExcel) {
        message.error("อนุญาตเฉพาะไฟล์ .pdf เท่านั้น");
      }
      return isExcel || Upload.LIST_IGNORE;
    },
  };

  return (
    <>
      <Select
        defaultValue={examType}
        className="w-24 text-center   "
        onChange={(value: "MIDTERM" | "FINAL") => setExamType(value)}
        disabled={status !== "waiting"}
      >
        <Option value="MIDTERM">Midterm</Option>
        <Option value="FINAL">Final</Option>
      </Select>
      <Upload {...props} disabled={status !== "waiting" && status !== "failed"}>
        <Button
          icon={<UploadOutlined />}
          disabled={(status !== "waiting" && status !== "failed")}
        >
          Click to Upload
        </Button>
      </Upload>
    </>
  );
};

export default UploadPdf;
