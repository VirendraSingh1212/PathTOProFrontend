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
        <div className={`group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 ${disabled ? "opacity-75" : ""}`}>
            {/* Cover Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={coverSrc}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = fallbackImage; }}
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Status Badge */}
                {status === "preview" && (
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase border border-white/10 shadow-xl">
                        FREE PREVIEW
                    </div>
                )}

                {/* Coming Soon Overlay */}
                {disabled && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-2 rounded-full shadow-2xl">
                            <span className="text-white font-black text-sm tracking-widest uppercase">Coming Soon</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col bg-white relative">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-black transition-colors">
                        {title}
                    </h3>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {description}
                </p>

                <div className="mt-auto space-y-5">
                    {/* Progress Section */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                            <span className="text-[11px] font-black text-black">{progressPercent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        className={`w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300 transform
                            ${disabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-900 hover:shadow-black/20 hover:shadow-xl active:scale-[0.98] group-hover:translate-y-[-2px]"
                            }`}
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
