import { prisma } from '@/lib/prisma';

type ContentPageProps = { title: string; settingKey: string; description: string };

export async function ContentPage({ title, settingKey, description }: ContentPageProps) {
  let content: string | undefined;
  try {
    const setting = await prisma.setting.findUnique({ where: { key: settingKey }, select: { value: true } });
    content = setting?.value?.trim();
  } catch {
    content = undefined;
  }

  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-20 dark:bg-slate-900">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-800 md:p-12">
        <h1 className="mb-4 text-4xl font-bold text-[#1B2A6B] dark:text-white">{title}</h1>
        <p className="mb-10 text-slate-600 dark:text-slate-300">{description}</p>
        {content ? <div className="whitespace-pre-wrap leading-8 text-slate-700 dark:text-slate-200">{content}</div> : <p className="text-slate-500 dark:text-slate-400">This information has not been published yet.</p>}
      </article>
    </main>
  );
}
