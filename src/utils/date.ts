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

export const parseDate = (raw: string) => {
  if (!raw) return new Date(NaN);
  const cleaned = raw.trim().replace(/\s+/g, " ");
  const m = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  if (!m) {
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? new Date(NaN) : d;
  }
  const mon = m[1].slice(0, 3).toUpperCase();
  const day = parseInt(m[2], 10);
  const monthMap: Record<string, number> = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };
  const monthIdx = monthMap[mon] ?? NaN;
  if (isNaN(monthIdx)) return new Date(NaN);
  const year = new Date().getFullYear();
  return new Date(year, monthIdx, day);
};
