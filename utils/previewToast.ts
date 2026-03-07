// utils/previewToast.ts
export function initPreviewToast() {
    // Very small lightweight toast that appears near bottom-right
    if (typeof window === "undefined") return;

    const handlePreviewRequireLogin = (ev: Event) => {
        const msg = "Please sign in to unlock the full experience";
        const id = `preview-toast-${Date.now()}`;
        const t = document.createElement("div");
        t.id = id;
        t.textContent = msg;
        t.style.position = "fixed";
        t.style.right = "20px";
        t.style.bottom = "92px";
        t.style.background = "#111";
        t.style.color = "#fff";
        t.style.padding = "10px 14px";
        t.style.borderRadius = "10px";
        t.style.boxShadow = "0 8px 40px rgba(0,0,0,0.35)";
        t.style.zIndex = "99999";
        t.style.opacity = "0";
        t.style.transition = "opacity .18s ease, transform .18s ease";
        t.style.transform = "translateY(6px)";
        document.body.appendChild(t);

        // animate in
        requestAnimationFrame(() => {
            t.style.opacity = "1";
            t.style.transform = "translateY(0)";
        });

        setTimeout(() => {
            t.style.opacity = "0";
            t.style.transform = "translateY(6px)";
            setTimeout(() => t.remove(), 220);
        }, 2200);
    };

    window.addEventListener("preview:require-login", handlePreviewRequireLogin);

    // Return cleanup function
    return () => {
        window.removeEventListener("preview:require-login", handlePreviewRequireLogin);
    };
}
