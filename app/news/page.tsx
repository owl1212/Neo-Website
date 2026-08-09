import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: "The latest from NEO Zambia — partnerships, community programmes, and events.",
};

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

export default async function NewsPage() {
  const posts = await getNews();

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,109,41,0.15) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="section-label mb-6">Latest news</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4">
            {"NEO's"} story, unfolding.
          </h1>
          <p className="text-lg text-[#bababa] max-w-xl">
            Partnerships, community programmes, product launches, and events — {"all"} the latest
            from {"Zambia's"} own laptop brand.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#7a7178]">No news posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <article
                key={post.slug}
                className={`card-glass rounded-[20px] overflow-hidden hover:border-[rgba(255,109,41,0.3)] transition-all duration-300 flex flex-col ${i === 0 ? "md:col-span-2" : ""}`}
              >
                {/* Cover */}
                <div
                  className={`${i === 0 ? "h-72" : "h-48"} bg-gradient-to-br from-[#FF6D29]/15 to-[#453027]/20 relative overflow-hidden flex items-end p-6`}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
                  />
                  <span
                    className={`inline-flex items-center border rounded-full px-3 py-1 text-[11px] font-semibold ${categoryColors[post.category]}`}
                  >
                    {categoryLabels[post.category]}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-[#7a7178] mb-3">{formatDate(post.date)}</p>
                  <h2 className={`font-extrabold text-white mb-3 leading-tight ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg"}`}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-[#bababa] leading-relaxed mb-4">{post.excerpt}</p>
                  )}
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6D29]">
                      Read more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
