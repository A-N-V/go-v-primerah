import Toc from "@/components/Toc";
import { Badge } from "@/components/ui/badge";
import { examples, getGroups } from "@/lib/examples";

export default function Home() {
  const groups = getGroups();

  return (
    <>
      <section className="mb-10 max-w-3xl">
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge variant="secondary">{examples.length} примеров</Badge>
          <Badge variant="secondary">{groups.length} тем</Badge>
          <Badge variant="outline">Go 1.25+</Badge>
        </div>
        <h1 className="mb-5 font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
          Go <span className="text-primary">в примерах</span>
        </h1>
        <div className="grid max-w-[62ch] gap-3 text-base text-muted-foreground sm:text-lg">
          <p>
            <a className="text-primary underline underline-offset-3" href="https://go.dev">
              Go
            </a>{" "}
            — язык с открытым исходным кодом для надёжных, быстрых и простых в сопровождении программ.
          </p>
          <p>
            Здесь Go изучается на {examples.length} коротких рабочих программах. Каждая разбита на фрагменты с пояснениями
            на русском, а в конце показан вывод программы в терминале.
          </p>
        </div>
      </section>
      <Toc groups={groups} />
    </>
  );
}
