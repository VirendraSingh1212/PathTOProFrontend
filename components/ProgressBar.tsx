type Props = {
    completed: number;
    total: number;
    /** Accent color class e.g. "bg-blue-600" — defaults to blue */
    colorClass?: string;
};

export default function ProgressBar({ completed, total, colorClass = "bg-blue-600" }: Props) {
    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>Progress</span>
                <span>{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <p className="text-xs text-gray-400">{completed} of {total} lessons complete</p>
        </div>
    );
}
