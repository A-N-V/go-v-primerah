# Go в примерах

Учебник по Go на русском: 85 коротких программ с пояснениями. Для каждого примера генерируется отдельная статическая страница (`/hello-world`, `/goroutines`, …).

Стек: Next.js 16, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) (компоненты в `components/ui`, новые добавляются через `npx shadcn@latest add <имя>`), next-themes для светлой и тёмной темы.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка
```

## Контент

Тексты пояснений и подсвеченный код лежат в `content/examples.json`. Чтобы поправить пример, отредактируйте его там.

## Деплой

Импортируйте репозиторий на [vercel.com/new](https://vercel.com/new), настройки по умолчанию подходят. После этого каждый `git push` в `main` обновляет сайт.

Материал основан на [Go by Example](https://gobyexample.com) Марка Макгранахана и Илая Бендерски (CC BY 3.0).
