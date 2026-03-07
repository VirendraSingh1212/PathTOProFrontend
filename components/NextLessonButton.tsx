"use client";

type DefaultLesson = {
    id: string;
    title: string;
};

type Props<T extends DefaultLesson> = {
    lessons: T[];
    currentLessonId: string;
    onNext: (lesson: T) => void;
    disabled?: boolean;
};

export default function NextLessonButton<T extends DefaultLesson>({ lessons, currentLessonId, onNext, disabled = false }: Props<T>) {
    const index = lessons.findIndex((l) => l.id === currentLessonId);
    const nextLesson = index >= 0 ? lessons[index + 1] : undefined;

    return (
        <button
            data-protected="true"
            disabled={!nextLesson || disabled}
            onClick={() => nextLesson && !disabled && onNext(nextLesson)}
            aria-disabled={!nextLesson || disabled}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm
                 hover:bg-blue-700 active:scale-95 transition-all shadow-sm
                 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
        >
            {nextLesson ? (
                <>Next Lesson →</>
            ) : (
                <>Course Complete 🎉</>
            )}
        </button>
    );
}
