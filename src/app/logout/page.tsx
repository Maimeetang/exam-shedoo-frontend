"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    axios.post("/api/auth/signout").then((res) => {
      if (res.data.ok) {
        router.replace("/");
      }
    });
  }, []);
  return <div className="p-3">{"Redirecting ..."}</div>;
}
