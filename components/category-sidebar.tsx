// components/category-sidebar.tsx
import Link from "next/link"

const categories = [
  { name: "所有文章", href: "/posts" },
  { name: "精选文章", href: "/category/featured" },
  { name: "技术解析", href: "/category/tech" },
  { name: "每周更新", href: "/category/weekly" },
]

export function CategorySidebar() {
  return (
    <div className="sticky top-4">
      <h3 className="font-medium mb-4">分类</h3>
      <nav className="space-y-1">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="block px-3 py-2 rounded-md hover:bg-accent text-sm"
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}