import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="py-16">
      <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight">
        Такого примера <span className="text-primary">нет</span>
      </h1>
      <Button asChild>
        <Link href="/">Вернуться к оглавлению</Link>
      </Button>
    </section>
  );
}
