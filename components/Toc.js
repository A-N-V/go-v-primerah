"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { store } from "./store";

export default function Toc({ groups }) {
  const [q, setQ] = useState("");
  const [last, setLast] = useState(null);
  const all = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // «Продолжить» — последний открытый пример
  useEffect(() => {
    const slug = store.get("last");
    setLast(all.find((e) => e.slug === slug) ?? null);
  }, [all]);

  const query = q.trim().toLowerCase();
  const filtered = groups
    .map((g, k) => ({
      ...g,
      stage: roman(k + 1),
      items: g.items.filter((e) => !query || `${e.title} ${e.en} ${e.slug}`.toLowerCase().includes(query)),
    }))
    .filter((g) => g.items.length);

  const start = last ?? all[0];

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-11 max-w-full min-w-0 px-4 text-[0.95rem] sm:max-w-md">
          <Link href={`/${start.slug}`}>
            <span className="shrink-0">{last ? "Продолжить:" : "Начать с"}</span>
            <b className="min-w-0 truncate font-semibold">{start.title}</b>
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
        <div className="relative flex-1 sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            className="h-11 pl-9 text-[0.95rem]"
            placeholder="Фильтр: срезы, select, json…"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => (
          <Card key={g.name} size="sm" className="gap-2">
            <CardHeader className="border-b">
              <CardTitle className="flex items-baseline gap-2.5 font-sans text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                <span className="min-w-7 font-heading text-sm tracking-normal text-primary">{g.stage}</span>
                {g.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-1.5">
              <ol>
                {g.items.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/${e.slug}`}
                      className="group flex items-baseline gap-3 rounded-md px-2 py-1.5 text-[0.95rem] transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="min-w-5 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{e.n}</span>
                      <span className="min-w-0 flex-1 group-hover:text-primary">{e.title}</span>
                      <span className="hidden max-w-[45%] min-w-0 truncate text-right font-mono text-[0.7rem] text-muted-foreground sm:block">
                        {e.en}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
      {!filtered.length && <p className="text-muted-foreground">Ничего не нашлось. Попробуйте другое слово.</p>}
    </>
  );
}

// Номер этапа римскими цифрами (групп немного, хватает до 39)
function roman(n) {
  return "X".repeat(Math.floor(n / 10)) + ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][n % 10];
}
