import React from "react";

type Props = {
    onClick: () => void;
};

export default function ChatFAB({ onClick }: Props) {
    return (
        <button
            className="fixed right-6 bottom-6 w-14 h-14 rounded-full border-none shadow-xl cursor-pointer z-[1100] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-3xl pb-1"
            style={{ background: "linear-gradient(180deg,#7c3aed,#2b6cb0)", color: "white" }}
            onClick={onClick}
            aria-label="Open chat assistant"
        >
            💬
        </button>
    );
}
