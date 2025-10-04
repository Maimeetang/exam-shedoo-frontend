import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const formatDate = (date?: string | Date, semester?: 1 | 2) => {
  let year = dayjs().year();
  if (semester === 2) year += 1;
  return date ? `${dayjs(date).format("DD/MM")}/${year}` : "-";
};

export const formatDateRange = (start?: string | Date, end?: string | Date) => {
  if (!start && !end) return "-";
  if (!start) return formatDate(end);
  if (!end) return formatDate(start);

  return `${formatDate(start)} - ${formatDate(end)}`;
};

export const formatTime = (time?: string) => {
  if (!time || time.length !== 4) return time || "-";
  const hours = time.slice(0, 2);
  const minutes = time.slice(2, 4);
  return `${hours}:${minutes}`;
};

export const formatTimeRange = (start?: string, end?: string) => {
  if (!start && !end) return "-";
  if (!start) return formatTime(end);
  if (!end) return formatTime(start);

  return `${formatTime(start)} - ${formatTime(end)}`;
};

export const toDayjs = (date?: Date | null): dayjs.Dayjs | null => {
  if (!date) return null;
  return dayjs(date).year(new Date().getFullYear());
};
