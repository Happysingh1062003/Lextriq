/**
 * Mobile-safe clipboard copy.
 * Uses navigator.clipboard when available, falls back to
 * a temporary textarea + execCommand("copy") for mobile browsers
 * that don't support the Clipboard API (or block it on HTTP).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    // Try modern API first
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fall through to fallback
        }
    }

    // Fallback: temporary textarea
    try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);

        // iOS requires special selection handling
        const range = document.createRange();
        const selection = window.getSelection();
        textarea.contentEditable = "true";
        textarea.readOnly = false;
        range.selectNodeContents(textarea);
        selection?.removeAllRanges();
        selection?.addRange(range);
        textarea.setSelectionRange(0, text.length);

        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        return success;
    } catch {
        return false;
    }
}
