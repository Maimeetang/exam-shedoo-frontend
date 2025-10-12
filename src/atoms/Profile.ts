import { atom } from "jotai";
import { Profile } from "@/types/Profile";

export const profileAtom = atom<Profile | null>(null);
