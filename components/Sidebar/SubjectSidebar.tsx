'use client';

import { useSidebarStore, type Section } from '@/store/sidebarStore';
import SectionItem from './SectionItem';

export default function SubjectSidebar({ subjectId }: { subjectId: string }) {
    const { subjectTree } = useSidebarStore();

    // Ensure subjectTree is an iterable array
    const safeSections = Array.isArray(subjectTree)
        ? subjectTree
        : (Array.isArray((subjectTree as { sections?: Section[] })?.sections) ? (subjectTree as { sections?: Section[] }).sections ?? [] : []);

    // Sort sections by order_index
    const sortedSections = [...safeSections].sort((a, b) => a.order_index - b.order_index);

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
                <h2 className="font-bold text-lg tracking-tight text-gray-900">Course Content</h2>
            </div>
            <div className="flex-1 overflow-y-auto pb-8">
                {sortedSections.length === 0 ? (
                    <div className="p-8 text-sm text-gray-500 text-center">No content available.</div>
                ) : (
                    Array.isArray(sortedSections) && sortedSections.map((section) => (
                        <SectionItem key={section?.id} section={section} subjectId={subjectId} />
                    ))
                )}
            </div>
        </div>
    );
}
