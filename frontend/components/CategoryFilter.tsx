import { Category, categories } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
        Categories
      </h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200",
              "hover:shadow-md active:scale-95",
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
