import "@ant-design/v5-patch-for-react-19";

import "@/styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F2F2F2]">
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
