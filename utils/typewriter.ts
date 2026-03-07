export function typeWriter(element: HTMLElement | null, text: string, speed = 15) {
    if (!element) return;
    element.innerHTML = "";
    let i = 0;

    function typing() {
        if (i < text.length) {
            element!.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}
