"use client";
import axios from "axios";
import { Profile } from "@/types/Profile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/component/Spinner";

export default function DashboardLayout() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Profile>("/api/auth/profile")
      .then((res) => {
        const profile = res.data;
        switch (profile.role) {
          case "student":
            router.push("/dashboard/student");
            break;
          case "admin":
            router.push("/dashboard/admin");
            break;
          case "professor":
            router.push("/dashboard/professor");
            break;
          default:
            router.push("/");
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Something went wrong");
        }
      });
  }, []);

  if (error) {
    return <div className="p-3">Error: {error}</div>;
  }

  return <Spinner />;
}
