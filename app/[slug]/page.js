import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { examples, getExample } from "@/lib/examples";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ExampleTools from "@/components/ExampleTools";
import WrapToggle from "@/components/WrapToggle";
import DocsModeToggle from "@/components/DocsModeToggle";
import SegmentGuide from "@/components/SegmentGuide";

export const dynamicParams = false;

export function generateStaticParams() {
  return examples.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const ex = getExample((await params).slug);
  return ex ? { title: ex.title, description: `${ex.title} (${ex.en}) — пример на Go с пояснениями.` } : {};
}

export default async function ExamplePage({ params }) {
  const ex = getExample((await params).slug);
  if (!ex) notFound();

  const prev = ex.prev ? { href: `/${ex.prev.slug}`, label: "Назад", title: ex.prev.title } : { href: "/", label: "Назад", title: "Оглавление" };
  const next = ex.next ? { href: `/${ex.next.slug}`, label: "Далее", title: ex.next.title } : { href: "/", label: "Готово", title: "Оглавление" };

  return (
    <article>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Оглавление</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{ex.group}</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{ex.title}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-8">
        <h1 className="mb-3 font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
          {ex.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {ex.file}
          </Badge>
          <Badge variant="outline">
            {ex.n} из {examples.length}
          </Badge>
          {ex.en !== ex.title && <span className="text-sm text-muted-foreground">{ex.en}</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 md:hidden">
          <DocsModeToggle />
          <WrapToggle />
        </div>
      </header>

      <div id="ex-body" className="prose-ex" dangerouslySetInnerHTML={{ __html: ex.srcHtml + ex.restHtml }} />
      <ExampleTools slug={ex.slug} code={ex.code} prev={prev.href} next={next.href} />
      <SegmentGuide slug={ex.slug} />

      <nav className="mt-4 grid grid-cols-2 gap-3" aria-label="Соседние примеры">
        <PagerLink {...prev} dir="prev" />
        <PagerLink {...next} dir="next" />
      </nav>
    </article>
  );
}

function PagerLink({ href, label, title, dir }) {
  const Icon = dir === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <Link
      href={href}
      className={
        "group flex min-w-0 flex-col justify-center rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/60 hover:bg-accent " +
        (dir === "next" ? "items-end text-right" : "")
      }
    >
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {dir === "prev" && <Icon className="size-3.5" />}
        {label}
        {dir === "next" && <Icon className="size-3.5" />}
      </span>
      <span className="max-w-full truncate font-medium group-hover:text-primary">{title}</span>
    </Link>
  );
}
