"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { HomeIcon, MagnifyingGlassIcon, BellIcon } from "@/lib/icons";

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
                    <HomeIcon className="block" width={18} height={18} />
                </Link>

                <div className="ds-header-search">
                    <MagnifyingGlassIcon className="ds-header-search-icon block" width={18} height={18} />
                    <input type="text" placeholder="Search courses, lessons..." />
                </div>
            </div>

            {/* Right */}
            <div className="ds-header-right">
                <button className="ds-header-bell" aria-label="Notifications">
                    <BellIcon className="block" width={20} height={20} />
                    <span className="ds-header-bell-dot" />
                </button>

                <Link href="/profile" className="ds-header-avatar" title="Profile">
                    {initials}
                </Link>
            </div>
        </header>
    );
}
