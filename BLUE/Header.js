// Header.js
window.Header = function Header({ theme, myTeam, rightContent }) {
    const e = React.createElement;
    return e(
        "div",
        { className: `fixed top-0 left-0 w-full p-4 bg-gray-900 border-b ${theme.border} flex justify-between items-center z-20 shadow-md` },
        e(
            "div",
            { className: `${theme.text} font-bold text-lg flex items-center gap-2 font-mono tracking-wider` },
            e(window.Icon, { name: "Terminal", size: 20 }),
            myTeam ? `[${myTeam.toUpperCase()}_UNIT]` : "[SYSTEM_STANDBY]"
        ),
        rightContent || null
    );
};