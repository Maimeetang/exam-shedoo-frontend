import { atom } from "jotai";
import { TeachingCourse } from "@/types/professor/TeachingCourse";

export const coursesAtom = atom<TeachingCourse[]>([]);
export const mergeModeAtom = atom(false);
export const selectedRowKeysAtom = atom<React.Key[]>([]);
