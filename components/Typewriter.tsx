"use client";

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    showCursor?: boolean;
    onComplete?: () => void;
}

export default function Typewriter({
    text,
    speed = 40,
    delay = 0,
    className = "",
    showCursor = true,
    onComplete
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsStarted(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;

        if (displayedText.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, speed);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [displayedText, text, speed, isStarted, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {showCursor && displayedText.length < text.length && (
                <span className="animate-pulse border-r-2 border-current ml-1" />
            )}
        </span>
    );
}
