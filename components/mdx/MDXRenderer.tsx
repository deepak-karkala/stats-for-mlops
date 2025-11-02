import { ReactElement } from "react";

interface MDXRendererProps {
  children: ReactElement;
}

/**
 * Wrapper component for rendering compiled MDX content from next-mdx-remote/rsc.
 * The content is already compiled and doesn't need additional processing.
 */
export const MDXRenderer = ({ children }: MDXRendererProps) => {
  return children;
};
