# Go в примерах

Next.js-версия учебника `go-v-primerah.html`: оглавление на главной и отдельная статическая страница для каждого из 85 примеров (`/hello-world`, `/goroutines`, …).

Стек: Next.js 16, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) (компоненты лежат в `components/ui`, добавлять новые — `npx shadcn@latest add <имя>`), next-themes для светлой/тёмной темы.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка
```

## Контент

Тексты и подсвеченный код лежат в `content/examples.json`. Файл собирается из `go-v-primerah.html`:

```bash
npm run extract
```

Чтобы поправить пример, отредактируйте HTML и перезапустите `extract` (или правьте JSON напрямую).

## Деплой на Vercel

1. Залейте эту папку в отдельный репозиторий на GitHub.
2. На vercel.com: **Add New → Project**, выберите репозиторий. Фреймворк Next.js определится сам, настройки менять не нужно.

Или без GitHub: `npx vercel` в этой папке.
