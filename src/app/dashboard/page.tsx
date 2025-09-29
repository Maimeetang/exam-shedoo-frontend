"use client";
import Navbar from "@/component/Navbar";
import { User } from "@/types/User";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get<User>("/api/auth/profile", { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        } else {
          router.push("/"); // redirect ไปหน้า login
        }
      })
      .catch(() => {
        router.push("/"); // ถ้า error ก็ redirect
      });
  }, [router]);

  return (
    <>
      <Navbar userName="Sirawit Kongkham" />
      <div className="p-3">
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </>
  );
}
