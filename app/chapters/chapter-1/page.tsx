import { loadAndCompileMDX } from "@/lib/mdx";
import { MDXRenderer } from "@/components/mdx/MDXRenderer";

export async function generateMetadata() {
  const { frontmatter } = await loadAndCompileMDX("app/chapters/chapter-1/content.mdx");
  return {
    title: `Chapter 1: ${frontmatter.title} - DriftCity`,
    description: frontmatter.description,
  };
}

export default async function Chapter1() {
  const { content, frontmatter } = await loadAndCompileMDX("app/chapters/chapter-1/content.mdx");

  return (
    <div className="chapter-page">
      <header className="chapter-header">
        <h1>{frontmatter.title}</h1>
        <p className="chapter-description">{frontmatter.description}</p>
      </header>

      <article className="chapter-content">
        <MDXRenderer>{content}</MDXRenderer>
      </article>

      <style>{`
        .chapter-page {
          width: 100%;
          max-width: 900px;
        }

        .chapter-header {
          margin-bottom: var(--space-8);
        }

        .chapter-page h1 {
          margin-bottom: var(--space-2);
        }

        .chapter-description {
          color: var(--color-text-secondary);
          font-size: var(--text-lg);
          margin-bottom: 0;
        }

        .chapter-content {
          line-height: var(--leading-relaxed);
        }

        .chapter-content h2 {
          margin-top: var(--space-8);
          margin-bottom: var(--space-4);
          scroll-margin-top: 80px;
        }

        .chapter-content h3 {
          margin-top: var(--space-6);
          margin-bottom: var(--space-3);
        }

        .chapter-content p {
          margin-bottom: var(--space-4);
        }

        .chapter-content code {
          font-size: 0.9em;
        }

        .chapter-content > *:first-child {
          margin-top: 0;
        }
      `}</style>
    </div>
  );
}
