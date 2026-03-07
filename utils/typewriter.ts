export function typeWriter(element: HTMLElement | null, text: string, speed = 30) {
    if (!element) return () => { };
    element.innerHTML = "";
    let i = 0;
    let active = true;
    function tick() {
        if (!active) return;
        if (i < text.length) {
            element!.innerHTML += text.charAt(i);
            i++;
            setTimeout(tick, speed);
        }
    }
    tick();
    return () => { active = false; };
}
