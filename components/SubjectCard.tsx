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
    "Full-Stack Development Masterclass": "/covers/fullstack.jpg",
    "System Design Fundamentals": "/covers/systemdesign.jpg",
    "Data Structures & Algorithms": "/covers/dsa.jpg",
};

export default function SubjectCard({ subject, fallbackImage, onOpen }: Props) {
    const { title, description, status = "available", progressPercent = 0 } = subject;

    const overlayText = status === "coming-soon" ? "Coming Soon" : status === "preview" ? "Free Preview" : null;
    const disabled = status === "coming-soon";

    const getStatusColor = () => {
        if (status === "preview") return "text-blue-600";
        if (status === "coming-soon") return "text-gray-400";
        return "text-gray-900 group-hover:text-blue-600 transition-colors";
    };

    return (
        <div className={`relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 ${!disabled ? "hover:shadow-xl hover:-translate-y-1" : "opacity-80"}`}>
            {/* Cover Image */}
            <div className="relative h-44 w-full overflow-hidden bg-gray-100 items-center justify-center flex">
                <img
                    src={
                        SUBJECT_COVERS[subject.title] ??
                        subject.thumbnail_url ??
                        fallbackImage
                    }
                    alt={title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${!disabled ? "group-hover:scale-110" : ""}`}
                    onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                    }}
                />
                {!disabled && <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <h2 className={`text-xl font-bold ${getStatusColor()}`}>
                    {title}
                </h2>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {description}
                </p>

                <div className="mt-auto pt-6">
                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                            <span>Progress</span>
                            <span className="text-blue-600">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                style={{
                                    width: `${progressPercent}%`,
                                }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => !disabled && onOpen(subject)}
                        disabled={disabled}
                        className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm ${disabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] group-hover:shadow-md"
                            }`}
                    >
                        {status === "available" ? "Continue Learning" : status === "preview" ? "Preview Course" : "Coming Soon"}
                    </button>
                </div>
            </div>

            {/* Overlay for status tags on image */}
            {overlayText && (
                <div className="absolute top-3 right-3 pointer-events-none">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${status === "coming-soon" ? "bg-gray-900/80 text-white" : "bg-blue-600/90 text-white"}`}>
                        {overlayText}
                    </div>
                </div>
            )}

            {/* Full hover overlay for coming soon */}
            {status === 'coming-soon' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="px-5 py-2.5 bg-white rounded-lg shadow-xl text-sm font-bold text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Coming Soon
                    </div>
                </div>
            )}
        </div>
    );
}
