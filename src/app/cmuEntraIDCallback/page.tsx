"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function cmuEntraIDCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const [message, setMessage] = useState("");

  useEffect(() => {
    //Next.js takes sometime to read parameter from URL
    //So we'll check if "code" is ready before calling sign-in api
    if (!code) return;

    axios
      .post("/api/auth/signin", { authorizationCode: code })
      .then((res) => {
        if (res.data.ok) {
          router.push("/dashboard");
        }
      })
      .catch((err) => {
        if (!err.response) {
          setMessage(
            "Cannot connect to CMU EntraID Server. Please try again later."
          );
        } else if (!err.response.data.ok) {
          setMessage(err.response.data.message);
        } else {
          setMessage("..Unknown error occurred. Please try again later.");
        }
      });
  }, [code]);

  return <div className="p-3">{message || "Redirecting ..."}</div>;
}
