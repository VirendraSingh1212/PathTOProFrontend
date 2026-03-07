"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
    HomeIcon,
    BookOpenIcon,
    CommandLineIcon,
    SparklesIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    AcademicCapIcon
} from "@/lib/icons";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/subjects", icon: HomeIcon },
    { label: "Courses", href: "/subjects", icon: BookOpenIcon },
    { label: "Learning Roadmap", href: "/subjects", icon: CommandLineIcon },
    { label: "AI Assistant", href: "/subjects", icon: SparklesIcon },
    { label: "Purchases", href: "/subjects", icon: CreditCardIcon },
    { label: "Settings", href: "/profile", icon: Cog6ToothIcon },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <aside className="ds-sidebar dashboard-sidebar">
            {/* Logo */}
            <div className="ds-sidebar-logo">
                <div className="ds-sidebar-logo-icon">
                    <AcademicCapIcon width={20} height={20} />
                </div>
                <div className="ds-sidebar-logo-text">
                    Path<span>To</span>Pro
                </div>
            </div>

            {/* Navigation */}
            <nav className="ds-sidebar-nav">
                <div className="ds-sidebar-section">Menu</div>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href && item.label === "Dashboard";

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`ds-sidebar-item sidebar-item-motion${isActive ? " active" : ""}`}
                        >
                            <Icon className="ds-sidebar-icon block" width={20} height={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer — Logout */}
            <div className="ds-sidebar-footer">
                <button className="ds-sidebar-logout" onClick={handleLogout}>
                    <ArrowRightOnRectangleIcon className="ds-sidebar-icon block" width={20} height={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
