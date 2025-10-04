import { dayColors } from "@/types/Color";

export function getHeaderTextColor(dateString: string): string {
  let key: string;
  switch (dateString) {
    case "Monday":
      key = "M";
      break;
    case "Tuesday":
      key = "Tu";
      break;
    case "Wednesday":
      key = "We";
      break;
    case "Thursday":
      key = "Th";
      break;
    case "Friday":
      key = "F";
      break;
    case "Saturday":
      key = "Sa";
      break;
    case "Sunday":
      key = "Su";
      break;
    default:
      key = "M";
  }

  return dayColors[key];
}

export function getStudentBgColor(studentCount: number): string {
  if (studentCount === 0) return "bg-white";
  if (studentCount <= 5) return dayColors.We;
  if (studentCount <= 10) return dayColors.M;
  if (studentCount <= 15) return dayColors.Th;
  if (studentCount <= 25) return dayColors.Su;

  return dayColors.F;
}
