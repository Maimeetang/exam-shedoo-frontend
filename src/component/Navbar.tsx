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
        <div className="flex items-center space-x-5 relative">
          <img
            src={`https://api.dicebear.com/9.x/notionists/svg?seed=${profile.student_id}`}
            alt="profile"
            className="h-12 w-auto bg-white rounded-full"
          />
          <div className="flex flex-col items-center">
            <p className="font-normal text-black">{`${profile.firstname_EN} ${profile.lastname_EN}`}</p>
            {profile.role === "student" && (
              <p className="font-normal text-black">{profile.student_id}</p>
            )}
          </div>
        </div>
        {profile.role === "admin" && <DropdownMenu />}
        {profile.role === "professor" || profile.role === "student" && (
          <Link href="/logout">
            <p className="text-black font-medium underline">Log out</p>
          </Link>
        )}
      </div>
    </nav>
  );
}
