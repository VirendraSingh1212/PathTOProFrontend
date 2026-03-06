import React from "react";

export type SubjectStatus = "available" | "preview" | "coming-soon";

export type Subject = {
    id: string;
    title: string;
    description: string;
    progressPercent?: number;
    thumbnail_url?: string;
    status?: SubjectStatus;
};

type Props = {
    subject: Subject;
    fallbackImage: string;
    onOpen: (subject: Subject) => void;
};

const SUBJECT_COVERS: Record<string, string> = {
    "Full-Stack Development Masterclass": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    "System Design Fundamentals": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
    "Data Structures & Algorithms": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
};

export default function SubjectCard({ subject, fallbackImage, onOpen }: Props) {
    const { title, description, status = "available", progressPercent = 0 } = subject;
    const disabled = status === "coming-soon";

    const getBtnLabel = () => {
        if (status === "coming-soon") return "Coming Soon";
        if (status === "preview") return "Preview Course";
        return "Continue Learning";
    };

    const coverSrc = SUBJECT_COVERS[title] ?? subject.thumbnail_url ?? fallbackImage;

    return (
        <div className={`subject-card${disabled ? " opacity-75 pointer-events-auto" : ""}`}>
            {/* Cover Image */}
            <img
                src={coverSrc}
                alt={title}
                onError={(e) => { e.currentTarget.src = fallbackImage; }}
            />

            {/* Status Badge */}
            {status === "preview" && (
                <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "#2563eb",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    letterSpacing: "0.04em",
                }}>
                    FREE PREVIEW
                </div>
            )}

            {/* Coming Soon Overlay */}
            {disabled && <div className="coming-overlay">Coming Soon</div>}

            {/* Card Body */}
            <div style={{ padding: "22px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "#111827" }}>
                    {title}
                </h3>

                <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px", lineHeight: 1.5 }}>
                    {description}
                </p>

                <div style={{ marginTop: "auto" }}>
                    {/* Progress */}
                    <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px", fontWeight: 600, letterSpacing: "0.05em" }}>
                        PROGRESS
                    </div>
                    <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "6px", overflow: "hidden", marginBottom: "18px" }}>
                        <div style={{ width: `${progressPercent}%`, background: "#2563eb", height: "100%", borderRadius: "6px", transition: "width 0.4s ease" }} />
                    </div>

                    {/* CTA Button */}
                    <button
                        className="continue-btn"
                        disabled={disabled}
                        onClick={() => !disabled && onOpen(subject)}
                    >
                        {getBtnLabel()}
                    </button>
                </div>
            </div>
        </div>
    );
}
