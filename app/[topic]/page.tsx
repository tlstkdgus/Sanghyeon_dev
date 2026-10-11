import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FIGURES } from "@/components/figures";
import type { Block } from "@/lib/blocks";
import { groupedDocs, minutesOf, topicBySlug, topics } from "@/lib/content";
import { outline } from "@/lib/sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) return {};
  return { title: topic.name, description: topic.intro };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) notFound();

  const groups = groupedDocs(topic);
  const planned = topic.status === "planned";
  const count = groups.reduce((a, g) => a + g.items.length, 0);

  // 카드마다 그 장의 첫 도식을 미리보기로, 섹션 수를 함께 보여줍니다 (빌드 타임 계산).
  const previews: Record<string, { fig?: string; sections: number }> = {};
  await Promise.all(
    groups.flatMap((g) => g.items).map(async (d) => {
      const mod = (await import(`@/content/${d.topic}/${d.slug}`)) as { default: Block[] };
      const first = mod.default.find((b) => b.t === "diagram");
      previews[d.slug] = {
        fig: first && first.t === "diagram" ? first.name : undefined,
        sections: outline(mod.default).length,
      };
    })
  );

  return (
    <div className="pb-8 lg:pl-12">
      <header className="py-16 sm:py-24">
        <p className="text-caption font-medium text-ink-dim">주제</p>
        <h1 className="mt-4 text-[2.5rem] font-medium leading-[1.02] tracking-[-0.05em] text-ink sm:text-display-lg">
          {topic.name}
        </h1>
        <p className="mt-6 max-w-[44ch] text-body-lg text-ink-muted">
          {topic.intro}
        </p>
        {!planned && (
          <p className="tnum mt-7 text-caption text-ink-dim">
            {count}장 · 약 {minutesOf(topic.slug)}분
          </p>
        )}
      </header>

      {planned ? (
        <Outline topic={topic} />
      ) : (
        <div className="space-y-14 pb-8">
          {groups.map(({ part, items }) => (
            <section key={part.key}>
              <h2 className="text-caption font-medium text-ink-dim">
                {part.name}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {items.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.topic}/${d.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[20px] border border-hairline bg-surface-1 transition-colors hover:border-ink-dim"
                  >
                    <Preview name={previews[d.slug]?.fig} />
                    <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-baseline gap-2.5">
                      <span className="tnum text-caption text-ink-dim">
                        {String(d.num).padStart(2, "0")}
                      </span>
                      <h3 className="text-body font-medium tracking-[-0.02em] text-ink">
                        {d.title}
                      </h3>
                    </div>
                    <p className="mt-2 flex-1 text-body-sm text-ink-muted">
                      {d.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      {d.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-micro text-ink-dim"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="tnum ml-auto text-micro text-ink-dim">
                        {previews[d.slug]?.sections ? `${previews[d.slug].sections}개 섹션 · ` : ""}
                        {d.minutes}분
                      </span>
                    </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/** 장의 첫 도식을 줄여 보여주는 미리보기. 도식이 없는 장은 그라디언트 면만. */
function Preview({ name }: { name?: string }) {
  const Fig = name ? FIGURES[name] : undefined;
  return (
    <div
      aria-hidden
      className="pointer-events-none relative h-40 overflow-hidden border-b border-hairline bg-canvas px-5 pt-4 [&_svg]:h-full [&_svg]:w-full"
    >
      {Fig ? (
        <div className="h-full opacity-90 transition-opacity group-hover:opacity-100">
          <Fig />
        </div>
      ) : (
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "linear-gradient(135deg, var(--grad-violet), var(--grad-magenta) 55%, var(--grad-orange))" }}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-canvas to-transparent" />
    </div>
  );
}

function Outline({ topic }: { topic: NonNullable<ReturnType<typeof topicBySlug>> }) {
  return (
    <div>
      <p className="max-w-[44ch] text-body-sm text-ink-dim">
        아직 쓰지 않았습니다. 다룰 예정인 목차는 아래와 같습니다. 순서와 제목은
        쓰면서 바뀝니다.
      </p>
      <ol className="mt-8 max-w-[46rem] overflow-hidden rounded-lg border border-hairline">
        {(topic.outline ?? []).map((line, i) => (
          <li
            key={line}
            className="grid grid-cols-[3rem_1fr] gap-x-2 border-b border-hairline-soft bg-surface-1 px-5 py-4 last:border-b-0"
          >
            <span className="tnum text-caption text-ink-dim">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-body-sm text-ink-muted">{line}</span>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-body-sm text-ink-dim">
        먼저 읽을 것이 필요하면{" "}
        <Link href="/web3" className="text-accent underline underline-offset-[3px]">
          Web3
        </Link>
        는 다 써 두었습니다.
      </p>
    </div>
  );
}
