"use client";

import DropdownMenu from "./DropdownMenu";

export default function Navbar({ userName }: { userName: string }) {
  return (
    <nav className="flex items-center justify-end bg-[#AD92B2] text-white px-6 py-3 h-20">
      <div className="flex items-center space-x-10 relative">
        <div className="font-light text-black">{userName}</div>
        <DropdownMenu />
      </div>
    </nav>
  );
}
