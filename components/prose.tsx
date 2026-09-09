/* eslint-disable @next/next/no-img-element */
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

function MdxLink({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} rel="noreferrer" target="_blank" {...props}>
      {children}
    </a>
  );
}

const components = {
  a: MdxLink,
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <img loading="lazy" decoding="async" {...props} alt={props.alt ?? ""} />
  ),
};

type ProseProps = {
  source: string;
};

export function Prose({ source }: ProseProps) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
