"use client";
import axios from "axios";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/component/Spinner";

export default function Logout() {
  const { isSuccess, isLoading } = useQuery<boolean, Error>({
    queryKey: ["signout"],
    queryFn: async () => {
      const res = await axios.post("/api/auth/signout");
      return res.data.ok;
    },
  });

  if (isLoading) return <Spinner />;

  if (isSuccess) {
    redirect("/");
  }
  return <div className="p-3">{"Redirecting ..."}</div>;
}
