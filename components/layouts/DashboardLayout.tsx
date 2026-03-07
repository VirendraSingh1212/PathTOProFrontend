"use client";

import "@/app/dashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <Header />
            <main className="dashboard-main">{children}</main>
        </div>
    );
}
