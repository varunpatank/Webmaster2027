"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/units", label: "Units" },
  { href: "/practice", label: "Practice" },
  { href: "/glossary", label: "Glossary" },
  { href: "/teachers", label: "Teachers" },
  { href: "/sources", label: "Sources" },
];

export default function SiteNav() {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Main">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={path === l.href || path.startsWith(l.href + "/") ? "page" : undefined}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
