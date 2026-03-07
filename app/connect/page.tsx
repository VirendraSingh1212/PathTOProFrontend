"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Trigger entrance animation shortly after mount
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const links = [
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/virendra-singh0066",
            icon: <Linkedin size={32} strokeWidth={1.5} />,
            description: "Connect with me professionally.",
        },
        {
            name: "GitHub",
            url: "https://github.com/VirendraSingh1212",
            icon: <Github size={32} strokeWidth={1.5} />,
            description: "Check out my open-source projects.",
        },
        {
            name: "M A I L",
            url: "mailto:singhvirendra2259@gmail.com",
            icon: <Mail size={32} strokeWidth={1.5} />,
            description: "Send me an email directly.",
        }
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f9fafb] flex flex-col pt-12 px-4 sm:px-6 lg:px-8 overflow-hidden items-center justify-center pb-24">
            {/* Back Button */}
            <div className="max-w-5xl w-full mx-auto mb-8">
                <a
                    href="/"
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors w-fit"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Home
                </a>
            </div>

            <div className="max-w-5xl w-full mx-auto">
                <div className={`text-center transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-4 tracking-tight">
                        Let's Connect
                    </h1>
                    <p className="text-lg text-gray-500 mb-16 max-w-xl mx-auto">
                        Reach out via any of these platforms. I'm always open to discussing new projects, creative ideas or opportunities!
                    </p>
                </div>

                <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                    {links.map((link, index) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex flex-col items-center p-10 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-out cursor-pointer
                ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
              `}
                            style={{ transitionDelay: `${200 + index * 200}ms` }}
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gray-50 group-hover:bg-black group-hover:text-white flex items-center justify-center text-black mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                                {link.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-black mb-3">{link.name}</h2>
                            <p className="text-sm text-gray-500 text-center leading-relaxed">{link.description}</p>

                            <div className="mt-8 w-12 h-1 bg-gray-200 group-hover:bg-black group-hover:w-24 transition-all duration-500 rounded-full" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
