export default function LessonSkeleton() {
    return (
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto p-8">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded-lg w-2/3" />

            {/* Progress bar skeleton */}
            <div className="h-3 bg-gray-200 rounded-full w-full" />

            {/* Video area skeleton */}
            <div className="aspect-video bg-gray-200 rounded-xl w-full" />

            {/* Action row skeleton */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="h-10 w-36 bg-gray-200 rounded-lg" />
                <div className="h-10 w-36 bg-gray-200 rounded-lg" />
            </div>
        </div>
    );
}
