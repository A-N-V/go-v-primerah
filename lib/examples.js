import examples from "../content/examples.json";

export { examples };

export function getExample(slug) {
  const i = examples.findIndex((e) => e.slug === slug);
  if (i < 0) return null;
  return { ...examples[i], n: i + 1, prev: examples[i - 1] ?? null, next: examples[i + 1] ?? null };
}

// Оглавление: группы в порядке появления
export function getGroups() {
  const groups = [];
  examples.forEach((e, i) => {
    let g = groups[groups.length - 1];
    if (!g || g.name !== e.group) groups.push((g = { name: e.group, items: [] }));
    g.items.push({ slug: e.slug, title: e.title, en: e.en, n: i + 1 });
  });
  return groups;
}
