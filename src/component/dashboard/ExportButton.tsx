import { Button } from "antd";
import React from "react";
import { toPng } from "html-to-image";

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  fileName?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  targetRef,
  fileName = "export.png",
}) => {
  const handleExport = async () => {
    if (!targetRef.current) return;

    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2, // ทำให้ภาพคมชัดขึ้น
        backgroundColor: "white", // พื้นหลังสีขาว
      });

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error exporting PNG:", error);
    }
  };

  return (
    <Button
      type="primary"
      className="!bg-[#3F5167] !text-white hover:!bg-[#2B3A52] border-none"
      onClick={handleExport}
    >
      Export PNG
    </Button>
  );
};

export default ExportButton;
