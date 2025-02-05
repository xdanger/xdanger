import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PostPreviewProps {
    title: string;
    date: string;
    preview: string;
    slug: string;
}

export function PostPreview({ title, date, preview, slug }: PostPreviewProps) {
    return (
        <Link href={`/${slug}`} className="block transition-all hover:scale-[1.02]">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {title}
                    </CardTitle>
                    <time className="text-sm text-gray-500">
                        {
                            new Date(date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                        }
                    </time>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                        {preview}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}