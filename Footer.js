// Footer.js
window.Footer = function Footer({ visible, theme, input, setInput, onSubmit, shake }) {
    if (!visible) return null;
    const e = React.createElement;
    return e(
        "div",
        { className: "fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 p-4 z-30 flex justify-center" },
        e(
            "div",
            { className: `w-full max-w-3xl flex gap-2 ${shake ? "glitch-effect" : ""}` },
            e("input", {
                type: "text",
                value: input,
                onChange: (ev) => setInput(ev.target.value),
                onKeyDown: (ev) => ev.key === "Enter" && onSubmit(),
                placeholder: "답변을 입력하시오...",
                className: `w-full p-3 rounded text-lg bg-gray-800 border-2 ${theme.border} text-white focus:outline-none font-mono`,
                autoComplete: "off"
            }),
            e("button", { onClick: onSubmit, className: `px-6 rounded font-bold transition-all ${theme.btn}` }, "입력")
        )
    );
};