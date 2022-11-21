import invariant from "tiny-invariant";

export function adjustThemeColor(color: string) {
    const meta = document.querySelector('meta[name="theme-color"]');
    invariant(meta);
    meta.setAttribute('content', color);
}