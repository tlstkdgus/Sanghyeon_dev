import type { Tone } from "@/lib/blocks";

/**
 * 콜아웃·카드의 의미(tone)를 글자보다 먼저 알아보게 하는 작은 선 아이콘.
 * 서버 컴포넌트입니다(정적 SVG). 색은 부모의 currentColor를 따릅니다.
 */
const PATHS: Record<Tone | "check" | "source" | "map" | "list", React.ReactNode> = {
  // 전구 — 비유
  fe: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z" />
    </>
  ),
  // 체크 원 — 잘 되는 것
  tip: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
    </>
  ),
  // 삼각형 느낌표 — 주의
  warn: (
    <>
      <path d="M10.3 4.2 2.6 17.6A2 2 0 0 0 4.3 20.6h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.5v4M12 17h.01" />
    </>
  ),
  // X 원 — 안 되는 것
  bad: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  // i 원 — 메모
  note: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  // 책 — 출처
  source: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
    </>
  ),
  // 지도 — 이 장의 지도
  map: (
    <>
      <path d="m9 4-6 2.5v14L9 18l6 2.5 6-2.5v-14L15 6.5z" />
      <path d="M9 4v14M15 6.5v14" />
    </>
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
};

export type IconName = keyof typeof PATHS;

export default function ToneIcon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      {PATHS[name]}
    </svg>
  );
}
