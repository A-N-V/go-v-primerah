"use client";

import { useEffect, useState } from "react";
import { PanelBottomIcon, RowsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "./store";

// Где показывать пояснения на телефоне: в панели снизу или между фрагментами кода
export default function DocsModeToggle() {
  const [inline, setInline] = useState(false);

  useEffect(() => {
    setInline(store.get("docs") === "inline");
  }, []);

  function toggle() {
    const next = !inline;
    setInline(next);
    store.set("docs", next ? "inline" : "panel");
    window.dispatchEvent(new Event("docsmode"));
  }

  return (
    <Button variant="outline" size="sm" className="md:hidden" onClick={toggle}>
      {inline ? <RowsIcon /> : <PanelBottomIcon />}
      Пояснения: {inline ? "в тексте" : "снизу"}
    </Button>
  );
}
