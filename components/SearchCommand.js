"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Палитра поиска по всем примерам, открывается по ⌘K / Ctrl+K или «/»
export default function SearchCommand({ items }) {
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  useEffect(() => {
    function onKey(e) {
      const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const groups = [];
  for (const it of items) {
    let g = groups[groups.length - 1];
    if (!g || g.name !== it.group) groups.push((g = { name: it.group, items: [] }));
    g.items.push(it);
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-9 justify-center px-0 text-muted-foreground sm:w-64 sm:justify-start sm:px-2.5"
        onClick={() => setOpen(true)}
        aria-label="Поиск"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Найти пример…</span>
        <Kbd className="ml-auto hidden sm:inline-flex">{mac ? "⌘K" : "Ctrl K"}</Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Поиск по примерам"
        description="Введите тему"
        className="sm:max-w-xl"
      >
        <Command filter={(value, search) => (value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0)}>
          <CommandInput placeholder="Срезы, select, json…" />
          <CommandList className="max-h-[60vh]">
            <CommandEmpty>Ничего не нашлось.</CommandEmpty>
            {groups.map((g) => (
              <CommandGroup key={g.name} heading={g.name}>
                {g.items.map((it) => (
                  <CommandItem
                    key={it.slug}
                    value={`${it.title} ${it.en} ${it.slug}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/${it.slug}`);
                    }}
                  >
                    <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{it.n}</span>
                    <span className="min-w-0 flex-1 truncate">{it.title}</span>
                    <span className="hidden max-w-[40%] shrink-0 truncate font-mono text-xs text-muted-foreground sm:block">
                      {it.en}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
