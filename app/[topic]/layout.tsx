import { notFound } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import { docsOf, topicBySlug } from "@/lib/content";

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

  const hasDocs = docsOf(topic.slug).length > 0;

  return (
    <div className="mx-auto flex max-w-[76rem] flex-col gap-0 px-5 sm:px-8 lg:flex-row">
      {hasDocs && <Sidebar topic={topic} />}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
