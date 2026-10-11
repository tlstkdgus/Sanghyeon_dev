import Link from "next/link";

import Quiz from "@/components/Quiz";
import { activeTopics, docs } from "@/lib/content";
import { questions } from "@/lib/quiz";

export const metadata = {
  title: "셀프 체크 퀴즈",
  description:
    "주제별 이해도를 확인하는 퀴즈. 틀린 문제는 해당 챕터로 연결됩니다.",
};

/** 문항이 하나라도 있는 주제만 섹션으로 보여줍니다. */
const topicsWithQuiz = activeTopics().filter((t) =>
  questions.some((q) => docs.find((d) => d.slug === q.chapter)?.topic === t.slug)
);

export default function QuizPage() {
  return (
    <main className="mx-auto max-w-[75rem] px-5 pb-16 sm:px-8">
      <header className="py-16 sm:py-24">
        <p className="text-caption font-medium text-ink-dim">부록</p>
        <h1 className="mt-4 text-[2.5rem] font-medium leading-[1.02] tracking-[-0.05em] text-ink sm:text-display-lg">
          셀프 체크
        </h1>
        <p className="mt-6 max-w-[42ch] text-body-lg text-ink-muted">
          전부 읽었다면 아래 문제들이 풀려야 합니다. 선택지를 고르면 해설과
          복습할 챕터 링크가 나옵니다.
        </p>
        <nav className="mt-8 flex flex-wrap gap-2.5">
          {topicsWithQuiz.map((t) => (
            <a
              key={t.slug}
              href={`#${t.slug}`}
              className="rounded-pill bg-surface-1 px-4 py-2 text-button font-medium text-ink transition-colors hover:bg-surface-2"
            >
              {t.name}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-20">
        {topicsWithQuiz.map((t) => (
          <section key={t.slug} id={t.slug} className="scroll-mt-24">
            <div className="mb-6 flex items-baseline gap-4">
              <h2 className="text-display-md text-ink">{t.name}</h2>
              <Link
                href={`/${t.slug}`}
                className="text-caption text-ink-dim transition-colors hover:text-ink"
              >
                주제 목차 →
              </Link>
            </div>
            <Quiz topic={t.slug} />
          </section>
        ))}
      </div>
    </main>
  );
}
