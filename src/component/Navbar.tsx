"use client";

import { Profile } from "@/types/Profile";
import DropdownMenu from "./DropdownMenu";
import Link from "next/link";

interface prop {
  profile: Profile;
}

export default function Navbar({ profile }: prop) {
  return (
    <nav className="flex items-center justify-end bg-[#AD92B2] text-white px-6 py-3 h-20">
      <div className="flex items-center space-x-10 relative">
        <img src="/profile.png" alt="profile" className="h-12 w-auto" />
        <div className="flex flex-col items-center">
          <p className="font-normal text-black">{`${profile.firstname_EN} ${profile.lastname_EN}`}</p>
          {profile.role === "student" && (
            <p className="font-normal text-black">{profile.student_id}</p>
          )}
        </div>
        {profile.role === "professor" ||
          (profile.role === "admin" && <DropdownMenu />)}
        {profile.role === "student" && (
          <Link href="/logout">
            <p className="text-black font-medium underline">Log out</p>
          </Link>
        )}
      </div>
    </nav>
  );
}
