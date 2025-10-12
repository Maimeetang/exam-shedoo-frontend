import { useAtom } from "jotai";
import { profileAtom } from "@/atoms/Profile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Profile } from "@/types/Profile";

export const useProfile = () => {
  const [profile, setProfile] = useAtom(profileAtom);
  const { error } = useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get<Profile>("/api/auth/profile");
      setProfile(res.data);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
  if (error) return { profile: null, error };
  return { profile, error };
};
