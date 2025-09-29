"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ปิด dropdown ถ้าคลิกนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-end bg-[#AD92B2] text-white px-6 py-3">
      <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        <div className="font-light text-black">{userName}</div>
        <button
          className="cursor-pointer px-4 py-2 rounded"
          onClick={() => setOpen(!open)}
        >
          <img className="w-6 h-6" src="/buttons/menu.png" alt="menu" />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-37 w-40 bg-white text-black rounded shadow-lg z-50">
            <button className="w-full text-left px-4 py-2 textbutton hover:bg-gray-200 cursor-pointer">
              Login Admin
            </button>
            <Link href="/logout">
              <button className="w-full text-left px-4 py-2 textbutton hover:bg-gray-200 cursor-pointer">
                log out
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
