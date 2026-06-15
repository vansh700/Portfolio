import { ChangeEvent } from "react";

type FilterProps = {
  search: string;
  setSearch: (value: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (ids: string[]) => void;
  techOptions: string[];
  selectedTech: string[];
  setSelectedTech: (tech: string[]) => void;
  categories: { id: string; name: string }[];
};

export default function ProjectFilterComponent({
  search,
  setSearch,
  selectedCategories,
  setSelectedCategories,
  techOptions,
  selectedTech,
  setSelectedTech,
  categories,
}: FilterProps) {
  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <section className="grid md:grid-cols-3 gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
      {/* Search */}
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded border px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Category multiselect */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.id)}
              onChange={() =>
                setSelectedCategories(toggleArray(selectedCategories, cat.id))
              }
            />
            <span className="text-sm">{cat.name}</span>
          </label>
        ))}
      </div>

      {/* Tech multiselect */}
      <div className="flex flex-wrap gap-2">
        {techOptions.map((tech) => (
          <label key={tech} className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTech.includes(tech)}
              onChange={() => setSelectedTech(toggleArray(selectedTech, tech))}
            />
            <span className="text-sm">{tech}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
