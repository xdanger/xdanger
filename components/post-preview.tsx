// components/post-preview.tsx
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface PostPreviewProps {
    title: string
    date: string
    preview: string
    slug: string
    featured?: boolean
}

export function PostPreview({ title, date, preview, slug, featured }: PostPreviewProps) {
    // 移除可能的.html后缀，让Next.js自己处理
    const cleanSlug = slug.replace(/\.html$/, '');

    return (
        <div className={featured ? "h-full flex flex-col" : ""}>
            <Link href={`/${cleanSlug}`}>
                <h2 className={`font-bold hover:text-primary ${featured ? "text-lg mb-2" : "text-xl mb-2"}`}>
                    {title}
                </h2>
            </Link>
            <p className="text-muted-foreground line-clamp-2 mb-3">{preview}</p>
            <div className={`text-sm text-muted-foreground ${featured ? "mt-auto" : ""}`}>
                发布于 {formatDate(date)}
            </div>
        </div>
    )
}