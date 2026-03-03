import { twMerge } from 'tailwind-merge';

export function Spinner({ className }: { className?: string }) {
    return (
        <div className={twMerge('animate-spin rounded-full h-8 w-8 border-b-2 border-primary', className)} />
    );
}
