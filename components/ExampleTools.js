"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "./store";

// Запоминает пример для «Продолжить», вставляет кнопку копирования в первый блок кода
// и листает примеры стрелками ← →
export default function ExampleTools({ slug, code, prev, next }) {
  const [slot, setSlot] = useState(null);
  const router = useRouter();

  useEffect(() => {
    store.set("last", slug);
    const host = document.querySelector(".src .code");
    if (!host) return;
    const el = document.createElement("div");
    el.className = "copy-slot";
    host.appendChild(el);
    setSlot(el);
    return () => el.remove();
  }, [slug]);

  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName) || document.querySelector("[role=dialog]")) return;
      if (e.key === "ArrowLeft") router.push(prev);
      if (e.key === "ArrowRight") router.push(next);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router, prev, next]);

  return slot ? createPortal(<CopyButton code={code} />, slot) : null;
}

function CopyButton({ code }) {
  const [done, setDone] = useState(false);

  function copy() {
    const ok = () => {
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    };
    const fallback = () => {
      const r = document.createRange();
      r.selectNodeContents(document.querySelector(".src"));
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
    };
    try {
      navigator.clipboard.writeText(code).then(ok, fallback);
    } catch {
      fallback();
    }
  }

  return (
    <Button variant="outline" size="sm" className="bg-background/90 backdrop-blur" onClick={copy}>
      {done ? <CheckIcon className="text-primary" /> : <CopyIcon />}
      {done ? "Скопировано" : "Копировать"}
    </Button>
  );
}
