import { ProvincePageContent } from '@/components/public/ProvincePageContent';

export default async function ProvincePage({ params }: { params: Promise<{ province: string }> }) {
  const { province } = await params;
  return <ProvincePageContent slug={province} />;
}
