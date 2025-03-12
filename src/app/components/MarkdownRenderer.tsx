import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import SyntaxHighlighter from "react-syntax-highlighter";
import { railscasts } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children, ...props }) => (
          <h1 className="text-2xl font-bold my-4" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-xl font-bold my-3" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-lg font-bold my-2" {...props}>
            {children}
          </h3>
        ),
        p: ({ children, ...props }) => (
          <p className="my-2" {...props}>
            {children}
          </p>
        ),
        ul: ({ children, ...props }) => (
          <ul className="list-disc pl-5 my-2" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal pl-5 my-2" {...props}>
            {children}
          </ol>
        ),
        table: ({ children, ...props }) => (
          <div className="rounded-lg border border-neutral-500 overflow-hidden">
            <table
              className="text-left w-full border-separate border-spacing-0"
              {...props}
            >
              {children}
            </table>
          </div>
        ),
        th: ({ children, ...props }) => (
          <th
            className="bg-neutral-700 px-4 py-2 font-bold text-white last:border-r-0 border-r border-neutral-500 border-b-white"
            style={{ borderBottom: "1px solid #737373" }}
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td
            className="px-4 py-2 border-b border-neutral-500 border-r last:border-r-0 first:border-l-0 first:border-t-0"
            {...props}
          >
            {children}
          </td>
        ),
        tr: ({ children, ...props }) => (
          <tr className="last:[&>*]:border-b-0" {...props}>
            {children}
          </tr>
        ),
        code: ({ children, className, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const isBlock = match || String(children).includes("\n");
          const language = match ? match[1] : "javascript";
          return isBlock ? (
            <SyntaxHighlighter
              language={language}
              style={railscasts}
              PreTag="div"
              className="bg-neutral-800 p-4 rounded-md overflow-auto text-white"
            >
              {String(children).trim()}
            </SyntaxHighlighter>
          ) : (
            <code
              className="bg-neutral-700 text-white px-2 py-1 mx-1 rounded-md text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
