import React from "react";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import Link from "next/link";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="/dashboard/professor/admin"
      >
        Admin Login
      </a>
    ),
  },
  {
    key: "2",
    label: <Link href="/logout">Log out</Link>,
  },
];

export default function DropdownMenu() {
  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <div className="h-20 flex items-center cursor-pointer">
        <img src="/buttons/menu.png" alt="Menu" className="h-6 w-6" />
      </div>
    </Dropdown>
  );
}
