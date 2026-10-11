/**
 * 본문 Block[]에서 「장 안의 구조」를 뽑아내는 순수 함수들.
 *
 * 렌더러(Blocks.tsx), 장 상단의 「이 장의 지도」, 사이드바의 섹션 목차가
 * 전부 이 파일을 거치므로 섹션 번호·앵커 id가 어디서나 같습니다.
 *
 * 규칙:
 *   - 최상위 `h3` 하나가 섹션 하나입니다. id는 `s-1`, `s-2` … 순서대로.
 *   - 제목이 「정리」인 `h3`와 바로 뒤 `ul`은 「핵심 정리」 카드로 따로 그립니다.
 *   - 제목이 「참고자료」인 `h3`와 바로 뒤 `ul`은 접히는 출처 목록으로 따로 그립니다.
 *   두 특수 섹션은 번호를 매기지 않습니다.
 */
import type { Block } from "./blocks";
import { plain } from "./blocks";

export const SUMMARY_TITLE = "정리";
export const REFERENCES_TITLE = "참고자료";

export type SectionInfo = { id: string; n: number; title: string };

const titleOf = (b: Block) => (b.t === "h3" ? plain(b.md).trim() : "");

export const isSummaryHeading = (b: Block) => b.t === "h3" && titleOf(b) === SUMMARY_TITLE;
export const isReferencesHeading = (b: Block) => b.t === "h3" && titleOf(b) === REFERENCES_TITLE;

/** 최상위 블록 인덱스 → 섹션 정보 (번호가 붙는 일반 h3만) */
export function sectionMap(blocks: Block[]): Map<number, SectionInfo> {
  const map = new Map<number, SectionInfo>();
  let n = 0;
  blocks.forEach((b, i) => {
    if (b.t !== "h3" || isSummaryHeading(b) || isReferencesHeading(b)) return;
    n += 1;
    map.set(i, { id: `s-${n}`, n, title: titleOf(b) });
  });
  return map;
}

/** 장의 섹션 목록 (목차용) */
export const outline = (blocks: Block[]): SectionInfo[] => Array.from(sectionMap(blocks).values());

/** 「정리」 h3 바로 뒤 목록의 항목들. 없으면 빈 배열. */
export function summaryOf(blocks: Block[]): string[] {
  const i = blocks.findIndex(isSummaryHeading);
  const next = i >= 0 ? blocks[i + 1] : undefined;
  return next && (next.t === "ul" || next.t === "ol") ? next.items : [];
}
