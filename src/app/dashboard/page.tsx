"use client";
import Navbar from "@/component/Navbar";
import { User } from "@/types/User";
import axios from "axios";
import { useEffect, useState } from "react";

export default function dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get<User>("api/auth/profile").then((res) => {
      setUser(res.data);
    });
  }, []);

  return (
    <>
      <Navbar userName="Sirawit Kongkham" />
      <div className="p-3">
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </>
  );
}
