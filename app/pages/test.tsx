import { useEffect, useState } from 'react';
import { getAllPosts } from '../lib/markdown';

export default function TestPage() {
    const [status, setStatus] = useState<{
        configCheck: string[];
        errors: string[];
    }>({
        configCheck: [],
        errors: [],
    });

    useEffect(() => {
        async function runTests() {
            const checks = [];
            const errors = [];

            // Test 1: Check if we can read posts
            try {
                const posts = await getAllPosts();
                checks.push(`✅ Found ${posts.length} blog posts`);
                checks.push(`✅ Sample post title: ${posts[0]?.title || 'No posts found'}`);
            } catch (err) {
                errors.push(`❌ Error reading posts: ${err.message}`);
            }

            // Test 2: Check Tailwind
            checks.push('✅ Tailwind CSS is active if this text is sans-serif');

            // Test 3: Check Shadcn UI
            try {
                // 只检查导入是否可用，不创建变量
                await import("@/components/ui/card");
                checks.push('✅ Shadcn UI components are available');
            } catch (err) {
                errors.push('❌ Shadcn UI components not found');
            }

            setStatus({ configCheck: checks, errors });
        }

        runTests();
    }, []);

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Configuration Test Results</h1>

            <div className="space-y-4">
                <div className="border p-4 rounded-lg">
                    <h2 className="font-semibold mb-2">Successful Checks:</h2>
                    {status.configCheck.map((check, i) => (
                        <div key={i} className="text-green-600 dark:text-green-400">
                            {check}
                        </div>
                    ))}
                </div>

                {status.errors.length > 0 && (
                    <div className="border p-4 rounded-lg bg-red-50 dark:bg-red-900/10">
                        <h2 className="font-semibold mb-2">Errors:</h2>
                        {status.errors.map((errorMsg, i) => (
                            <div key={i} className="text-red-600 dark:text-red-400">
                                {errorMsg}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}