"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Home, Search, Bell } from "lucide-react";

export default function Header() {
    const { user } = useAuthStore();

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "ST";

    return (
        <header className="ds-header dashboard-header">
            {/* Left */}
            <div className="ds-header-left">
                <Link href="/" className="ds-header-home" title="Home">
                    <Home size={18} />
                </Link>

                <div className="ds-header-search">
                    <Search className="ds-header-search-icon" />
                    <input type="text" placeholder="Search courses, lessons..." />
                </div>
            </div>

            {/* Right */}
            <div className="ds-header-right">
                <button className="ds-header-bell" aria-label="Notifications">
                    <Bell size={20} />
                    <span className="ds-header-bell-dot" />
                </button>

                <Link href="/profile" className="ds-header-avatar" title="Profile">
                    {initials}
                </Link>
            </div>
        </header>
    );
}
