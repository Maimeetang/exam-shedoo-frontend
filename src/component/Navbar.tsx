"use client";

import DropdownMenu from "./DropdownMenu";

interface prop {
  userName: string;
  code?: string;
}

export default function Navbar({ userName, code }: prop) {
  return (
    <nav className="flex items-center justify-end bg-[#AD92B2] text-white px-6 py-3 h-20">
      <div className="flex items-center space-x-10 relative">
        <img src="/profile.png" alt="profile" className="h-12 w-auto" />
        <div className="flex flex-col items-center">
          <p className="font-normal text-black">{userName}</p>
          <p className="font-normal text-black">{code}</p>
        </div>
        <DropdownMenu />
      </div>
    </nav>
  );
}
