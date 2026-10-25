"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "./store";

const DESKTOP = "(min-width: 768px)";
// Линия «чтения» на телефоне: фрагмент, пересёкший её, считается текущим
const ANCHOR = 0.35;

// Связывает пояснения с фрагментами кода.
// Компьютер: подсветка пары под курсором или в центре экрана.
// Телефон: код идёт сплошным листом, пояснение к текущему фрагменту — в панели снизу.
export default function SegmentGuide({ slug }) {
  const [desktop, setDesktop] = useState(true);
  const [mode, setMode] = useState("panel");
  const [segs, setSegs] = useState([]);
  const [i, setI] = useState(0);
  const panelRef = useRef(null);
  const lockUntil = useRef(0);

  useEffect(() => {
    const mq = matchMedia(DESKTOP);
    const sync = () => setDesktop(mq.matches);
    const syncMode = () => setMode(store.get("docs") === "inline" ? "inline" : "panel");
    sync();
    syncMode();
    mq.addEventListener("change", sync);
    window.addEventListener("docsmode", syncMode);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("docsmode", syncMode);
    };
  }, []);

  const guide = !desktop && mode === "panel";

  // Список фрагментов с пояснениями
  useEffect(() => {
    const root = document.getElementById("ex-body");
    const list = [...root.querySelectorAll(".seg")]
      .filter((s) => s.querySelector(".doc")?.textContent.trim())
      .map((el) => ({
        el,
        html: el.querySelector(".doc").innerHTML,
        kind: el.closest(".src") ? "Код" : "Запуск",
      }));
    setSegs(list);
    setI(0);
  }, [slug]);

  // Подсветка активного фрагмента
  useEffect(() => {
    const seg = segs[i]?.el;
    seg?.classList.add("is-active");
    return () => seg?.classList.remove("is-active");
  }, [segs, i]);

  // Компьютер: под курсором, иначе — в центре экрана
  useEffect(() => {
    if (!desktop || !segs.length) return;
    const root = document.getElementById("ex-body");
    const index = (el) => segs.findIndex((s) => s.el === el);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setI(index(en.target))),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    segs.forEach((s) => io.observe(s.el));
    const onOver = (e) => {
      const n = index(e.target.closest(".seg"));
      if (n >= 0) setI(n);
    };
    root.addEventListener("mouseover", onOver);
    return () => {
      io.disconnect();
      root.removeEventListener("mouseover", onOver);
    };
  }, [desktop, segs]);

  // Телефон: фрагмент на линии чтения, касание выбирает фрагмент
  useEffect(() => {
    const root = document.getElementById("ex-body");
    root.classList.toggle("guide", guide);
    if (!guide || !segs.length) return;

    let raf = 0;
    const pick = () => {
      raf = 0;
      if (Date.now() < lockUntil.current) return;
      const line = innerHeight * ANCHOR;
      let n = 0;
      // В самом верху страницы всегда первый фрагмент, даже если второй уже выше линии
      if (scrollY > 8) {
        segs.forEach((s, k) => {
          if (s.el.getBoundingClientRect().top <= line) n = k;
        });
      }
      setI(n);
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(pick));
    const onClick = (e) => {
      const n = segs.findIndex((s) => s.el === e.target.closest(".seg"));
      if (n >= 0) {
        lockUntil.current = Date.now() + 400;
        setI(n);
      }
    };
    pick();
    addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      root.removeEventListener("click", onClick);
      root.classList.remove("guide");
    };
  }, [guide, segs]);

  // Отступ снизу под панель, чтобы она не закрывала конец страницы
  useEffect(() => {
    const panel = panelRef.current;
    if (!guide || !panel) return;
    const ro = new ResizeObserver(() => (document.body.style.paddingBottom = panel.offsetHeight + "px"));
    ro.observe(panel);
    return () => {
      ro.disconnect();
      document.body.style.paddingBottom = "";
    };
  }, [guide, segs.length]);

  function go(n) {
    if (n < 0 || n >= segs.length) return;
    lockUntil.current = Date.now() + 700;
    setI(n);
    const top = segs[n].el.getBoundingClientRect().top + scrollY - innerHeight * ANCHOR + 4;
    scrollTo({ top, behavior: "smooth" });
  }

  if (!guide || !segs.length) return null;
  const seg = segs[i];

  return (
    <div
      ref={panelRef}
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgb(0_0_0/0.12)] backdrop-blur md:hidden"
    >
      <div className="h-0.5 bg-primary transition-[width] duration-300" style={{ width: `${((i + 1) / segs.length) * 100}%` }} />
      <div className="px-4 pt-2 pb-3">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {i + 1} / {segs.length}
          </span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground">
            {seg.kind}
          </span>
          <div className="ml-auto flex gap-1.5">
            <Button variant="outline" size="icon" className="size-9" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Предыдущий фрагмент">
              <ChevronUpIcon />
            </Button>
            <Button variant="outline" size="icon" className="size-9" onClick={() => go(i + 1)} disabled={i === segs.length - 1} aria-label="Следующий фрагмент">
              <ChevronDownIcon />
            </Button>
          </div>
        </div>
        <div
          key={i}
          className="prose-ex max-h-[30vh] animate-in overflow-y-auto text-[0.95rem] leading-relaxed duration-200 fade-in [&_p]:mb-1.5 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: seg.html }}
        />
      </div>
    </div>
  );
}
