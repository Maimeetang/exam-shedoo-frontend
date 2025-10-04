import { useEffect, useState } from "react";
import { Modal, Form, DatePicker, Select, message } from "antd";
import axios from "axios";
import { OrangeButton } from "./Button";
import { TeachingCourse } from "@/types/professor/TeachingCourse";
import { toDayjs } from "@/utils/date";

interface ExamModalProps {
  record: TeachingCourse;
  onExamUpdate: (updated: TeachingCourse) => void;
}

const ExamModal: React.FC<ExamModalProps> = ({ record, onExamUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [currentRecord, setCurrentRecord] = useState<TeachingCourse>(record);

  useEffect(() => {
    setCurrentRecord(record);
  }, [record]);

  const TIME_OPTIONS = [
    { label: "08:00 - 11:00", value: "0800-1100" },
    { label: "12:00 - 15:00", value: "1200-1500" },
    { label: "15:30 - 18:30", value: "1530-1830" },
  ];


  const handleOpen = () => {
    const midRange =
      currentRecord.midterm_start_time && currentRecord.midterm_end_time
        ? `${currentRecord.midterm_start_time.replace(":", "")}-${currentRecord.midterm_end_time.replace(":", "")}`
        : null;
    const finalRange =
      currentRecord.final_start_time && currentRecord.final_end_time
        ? `${currentRecord.final_start_time.replace(":", "")}-${currentRecord.final_end_time.replace(":", "")}`
        : null;

    form.setFieldsValue({
      midterm_date: toDayjs(currentRecord.midterm_date),
      midterm_time: midRange,
      final_date: toDayjs(currentRecord.final_date),
      final_time: finalRange,
    });

    setOpen(true);
  };


  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const [midStart, midEnd] = values.midterm_time?.split("-") || [];
      const [finalStart, finalEnd] = values.final_time?.split("-") || [];

      const payload = {
        courseCode: currentRecord.course_code,
        lecSection: currentRecord.lec_section,
        labSection: currentRecord.lab_section,
        courseID: currentRecord.course_id,
        midtermExamDate: values.midterm_date?.format("MMM  DD").toUpperCase(),
        midtermExamStartTime: midStart,
        midtermExamEndTime: midEnd,
        finalExamDate: values.final_date?.format("MMM  DD").toUpperCase(),
        finalExamStartTime: finalStart,
        finalExamEndTime: finalEnd,
      };

      let updatedRecord: TeachingCourse;

      if (currentRecord.exam_id) {
        await axios.put(`/api/professors/course_exams/${currentRecord.exam_id}`, payload);
        message.success("Exam updated successfully!");
        updatedRecord = {
          ...currentRecord,
          midterm_date: payload.midtermExamDate,
          final_date: payload.finalExamDate,
          midterm_start_time: payload.midtermExamStartTime,
          midterm_end_time: payload.midtermExamEndTime,
          final_start_time: payload.finalExamStartTime,
          final_end_time: payload.finalExamEndTime,
        };
      } else {
        const res = await axios.post("/api/professors/course_exams/examdate", payload);
        console.log(res);
        message.success("Exam created successfully!");
        updatedRecord = {
          ...currentRecord,
          exam_id: res.data.ID,
          midterm_date: payload.midtermExamDate,
          midterm_start_time: midStart,
          midterm_end_time: midEnd,
          final_date: payload.finalExamDate,
          final_start_time: finalStart,
          final_end_time: finalEnd,
        };
      }

      onExamUpdate(updatedRecord);
      setCurrentRecord(updatedRecord);

      setOpen(false);
    } catch (err) {
      console.error(err);
      message.error("Failed to save exam data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OrangeButton text="Edit Exam Date" onClick={handleOpen} />
      <Modal
        title={`Edit Exam Date for ${currentRecord.course_name}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="midterm_date" label="Midterm Date">
            <DatePicker format="DD MMM YYYY" />
          </Form.Item>

          <Form.Item name="midterm_time" label="Midterm Time">
            <Select options={TIME_OPTIONS} placeholder="Select a time range" />
          </Form.Item>

          <Form.Item name="final_date" label="Final Date">
            <DatePicker format="DD MMM YYYY" />
          </Form.Item>

          <Form.Item name="final_time" label="Final Time">
            <Select options={TIME_OPTIONS} placeholder="Select a time range" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExamModal;

