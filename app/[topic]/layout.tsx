import { notFound } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import type { Block } from "@/lib/blocks";
import { docsOf, topicBySlug } from "@/lib/content";
import { outline, type SectionInfo } from "@/lib/sections";

export default async function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const topic = topicBySlug(topicSlug);
  if (!topic) notFound();

  const list = docsOf(topic.slug);
  const hasDocs = list.length > 0;

  // 사이드바가 지금 읽는 장의 섹션 목차를 펼쳐 보여주도록, 장마다 섹션 목록을 미리 뽑아 둡니다.
  // (빌드 타임 SSG라 런타임 비용은 없습니다.)
  const outlines: Record<string, SectionInfo[]> = {};
  await Promise.all(
    list.map(async (d) => {
      const mod = (await import(`@/content/${d.topic}/${d.slug}`)) as { default: Block[] };
      outlines[d.slug] = outline(mod.default);
    })
  );

  return (
    <div className="mx-auto flex max-w-[76rem] flex-col gap-0 px-5 sm:px-8 lg:flex-row">
      {hasDocs && <Sidebar topic={topic} outlines={outlines} />}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
