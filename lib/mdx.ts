import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX as compileMDXSource } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/shortcodes";

export interface MDXFrontmatter {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export interface MDXContent {
  source: string;
  frontmatter: MDXFrontmatter;
}

export interface CompiledMDX {
  content: React.ReactElement;
  frontmatter: MDXFrontmatter;
}

/**
 * Load MDX file from the file system
 * @param filePath - Relative path from project root (e.g., 'app/chapters/chapter-1/content.mdx')
 * @returns Object containing source content and frontmatter
 */
export async function loadMDXFile(filePath: string): Promise<MDXContent> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      source: content,
      frontmatter: data as MDXFrontmatter,
    };
  } catch (error) {
    console.error(`Error loading MDX file at ${filePath}:`, error);
    throw new Error(`Failed to load MDX file: ${filePath}`);
  }
}

/**
 * Compile MDX content to React component
 * @param source - MDX source string
 * @returns Compiled React component
 */
export async function compileMDX(source: string): Promise<React.ReactElement> {
  try {
    const { content } = await compileMDXSource({ source, components: mdxComponents });
    return content;
  } catch (error) {
    console.error("Error compiling MDX:", error);
    throw new Error("Failed to compile MDX content");
  }
}

/**
 * Load and compile MDX file in one step
 * @param filePath - Relative path from project root
 * @param options - Optional component overrides and scope bindings for MDX
 * @returns Object containing compiled content and frontmatter
 */
interface LoadAndCompileOptions {
  components?: Record<string, unknown>;
  scope?: Record<string, unknown>;
}

export async function loadAndCompileMDX(
  filePath: string,
  options: LoadAndCompileOptions = {}
): Promise<CompiledMDX> {
  const { source, frontmatter } = await loadMDXFile(filePath);

  const components = options.components
    ? { ...mdxComponents, ...options.components }
    : mdxComponents;

  const compileArgs: Parameters<typeof compileMDXSource>[0] = {
    source,
    components,
  };

  if (options.scope) {
    compileArgs.options = { scope: options.scope };
  }

  const { content } = await compileMDXSource(compileArgs);

  return {
    content,
    frontmatter,
  };
}
