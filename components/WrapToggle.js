"use client";

import { useEffect, useState } from "react";
import { WrapTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "./store";

// Перенос строк в коде (кнопка видна только на телефоне)
export default function WrapToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(store.get("wrap") !== "0");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nowrap", !on);
  }, [on]);

  function toggle() {
    setOn(!on);
    store.set("wrap", on ? "0" : "1");
  }

  return (
    <Button
      variant={on ? "secondary" : "outline"}
      size="sm"
      className="md:hidden"
      aria-pressed={on}
      onClick={toggle}
    >
      <WrapTextIcon />
      Перенос: {on ? "вкл" : "выкл"}
    </Button>
  );
}
