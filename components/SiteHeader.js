import Link from "next/link";
import { examples } from "@/lib/examples";
import SearchCommand from "./SearchCommand";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  const items = examples.map((e, i) => ({ slug: e.slug, title: e.title, en: e.en, group: e.group, n: i + 1 }));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-heading text-sm font-bold">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-[0.7rem] text-primary-foreground">
            Go
          </span>
          <span className="hidden sm:inline">
            в <span className="text-primary">примерах</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <SearchCommand items={items} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
