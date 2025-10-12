"use client";

import { redirect } from "next/navigation";
import { useProfile } from "@/custom_hooks/use-profile";

export default function DashboardLayout() {
  const { profile, error } = useProfile();

  if (profile) {
    switch (profile?.role) {
      case "student":
        redirect("/dashboard/student");
      case "professor":
      case "admin":
        redirect("/dashboard/professor");
      default:
        redirect("/");
    }
  }

  if (error) return <div className="p-3">Error: {error.message}</div>;

  return null;
}

