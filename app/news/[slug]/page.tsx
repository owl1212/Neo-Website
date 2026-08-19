import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsPost, getNews } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getNews();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const categoryLabels: Record<string, string> = {
  partnership: "Partnership",
  csr: "Community",
  event: "Event",
};

const categoryColors: Record<string, string> = {
  partnership: "text-[#FF6D29] bg-[rgba(255,109,41,0.1)] border-[rgba(255,109,41,0.2)]",
  csr: "text-[#22d3ee] bg-[rgba(34,211,238,0.1)] border-[rgba(34,211,238,0.2)]",
  event: "text-[#a855f7] bg-[rgba(168,85,247,0.1)] border-[rgba(168,85,247,0.2)]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZM", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();

  return (
    <div className="pt-20 min-h-screen bg-[#0d0b0c]">
      {/* Back nav */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-[#7a7178] hover:text-white transition-colors mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          All news
        </Link>

        {/* Category + date */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`inline-flex items-center border rounded-full px-3 py-1 text-[11px] font-semibold ${categoryColors[post.category]}`}>
            {categoryLabels[post.category]}
          </span>
          <span className="text-sm text-[#7a7178]">{formatDate(post.date)}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-8">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-[#bababa] leading-relaxed mb-10 border-l-2 border-[#FF6D29] pl-5">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Cover image strip */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-10">
        <div className="w-full h-64 sm:h-80 rounded-[20px] bg-gradient-to-br from-[#FF6D29]/10 to-[#1a1518]" />
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        <div className="prose prose-invert prose-lg max-w-none">
          {post.body.split("\n\n").map((para, i) => (
            <p key={i} className="text-[#bababa] leading-relaxed mb-6">
              {para}
            </p>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6D29] hover:gap-3 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to all news
          </Link>
        </div>
      </div>
    </div>
  );
}
