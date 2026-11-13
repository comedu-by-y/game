// common.js
// ▼ 여기에 1단계에서 복사한 구글 시트 '웹에 게시(CSV)' 주소를 넣으세요.
window.SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/여기에_본인_주소_붙여넣기/pub?output=csv";

window.teamStyles = {
    red: { name: "RED", text: "text-red-500", border: "border-red-500", bg: "bg-red-950/30", btn: "bg-red-900 border-red-500 text-white hover:bg-red-600", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.4)]", emoji: "🔴" },
    blue: { name: "BLUE", text: "text-blue-500", border: "border-blue-500", bg: "bg-blue-950/30", btn: "bg-blue-900 border-blue-500 text-white hover:bg-blue-600", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]", emoji: "🔵" },
    green: { name: "GREEN", text: "text-green-500", border: "border-green-500", bg: "bg-green-950/30", btn: "bg-green-900 border-green-500 text-white hover:bg-green-600", shadow: "shadow-[0_0_15px_rgba(34,197,94,0.4)]", emoji: "🟢" },
    yellow: { name: "YELLOW", text: "text-yellow-400", border: "border-yellow-400", bg: "bg-yellow-950/30", btn: "bg-yellow-800 border-yellow-400 text-white hover:bg-yellow-600", shadow: "shadow-[0_0_15px_rgba(250,204,21,0.4)]", emoji: "🟡" },
    orange: { name: "ORANGE", text: "text-orange-500", border: "border-orange-500", bg: "bg-orange-950/30", btn: "bg-orange-900 border-orange-500 text-white hover:bg-orange-600", shadow: "shadow-[0_0_15px_rgba(249,115,22,0.4)]", emoji: "🟠" }
};

window.Icon = function Icon({ name, size = 24, className }) {
    const e = React.createElement;
    const props = { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className };
    const icons = {
        AlertTriangle: e("svg", props, e("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }), e("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), e("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })),
        Lock: e("svg", props, e("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }), e("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })),
        Wifi: e("svg", props, e("path", { d: "M5 12.55a11 11 0 0 1 14.08 0" }), e("path", { d: "M1.42 9a16 16 0 0 1 21.16 0" }), e("path", { d: "M8.53 16.11a6 6 0 0 1 6.95 0" }), e("line", { x1: "12", y1: "20", x2: "12.01", y2: "20" })),
        Cpu: e("svg", props, e("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", ry: "2" }), e("rect", { x: "9", y: "9", width: "6", height: "6" }), e("path", { d: "M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" })),
        CheckCircle: e("svg", props, e("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), e("polyline", { points: "22 4 12 14.01 9 11.01" })),
        Terminal: e("svg", props, e("polyline", { points: "4 17 10 11 4 5" }), e("line", { x1: "12", y1: "19", x2: "20", y2: "19" })),
        Key: e("svg", props, e("path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" }), e("path", { d: "m21 2-9.6 9.6" }), e("circle", { cx: "7.5", cy: "15.5", r: "5.5" }))
    };
    return icons[name] || null;
};

// CSV 파서 (쉼표가 포함된 문장도 안전하게 분리)
function parseCSVRow(row) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"' && row[i + 1] === '"') { current += '"'; i++; }
        else if (char === '"') { inQuotes = !inQuotes; }
        else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
        else { current += char; }
    }
    result.push(current.trim());
    return result;
}

// 특정 구역(siteNumber)의 문제만 구글 시트에서 불러오는 함수
window.loadSheetQuestions = async function(siteNumber) {
    // 캐시 방지를 위해 현재 시간 파라미터 추가
    const url = `${window.SHEET_CSV_URL}&t=${Date.now()}`;
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

    // 첫 줄(헤더) 제외 후 해당 구역 번호만 필터링
    return lines.slice(1).map(parseCSVRow).filter(cols => Number(cols[0]) === Number(siteNumber)).map(cols => ({
        type: cols[1] === "객관식" ? "choice" : "text",
        icon: cols[2] || "Lock",
        title: cols[3] || "",
        subText: cols[4] || "",
        question: cols[5] || "",
        codeBox: cols[6] || "",
        options: cols[7] ? cols[7].split("/").map(s => s.trim()).filter(Boolean) : [],
        answer: cols[8] ? cols[8].split("/").map(s => s.trim()).filter(Boolean) : [],
        hint: cols[9] || ""
    }));
};