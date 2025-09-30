"use client";
import Navbar from "@/component/Navbar";
import Spinner from "@/component/Spinner";
import { Enrollment } from "@/types/Enrollment";
import { Profile } from "@/types/Profile";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Profile>("/api/auth/profile")
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Something went wrong");
        }
      });
  }, []);

  useEffect(() => {
    if (!profile?.student_id) return;
    axios
      .get<Enrollment[]>(`/api/students/enrollments/${profile?.student_id}`)
      .then((res) => {
        setEnrollments(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [profile]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) return <Spinner />;

  return (
    <>
      <Navbar userName={`${profile.firstname_EN} ${profile.lastname_EN}`} />
      <div className="p-3">
        <pre>{JSON.stringify(enrollments, null, 2)}</pre>
      </div>
    </>
  );
}
