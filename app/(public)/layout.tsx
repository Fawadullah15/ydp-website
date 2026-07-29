import React from "react";
// Assuming Navbar and Footer are located in these paths. Update imports if needed.
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.setting.findMany({ where: { key: { in: ['site_name', 'seo_title', 'seo_description', 'seo_keywords', 'seo_og_image', 'site_favicon'] } } });
    const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value || '']));
    const title = values.seo_title || values.site_name || 'Youth Development Program (YDP)';
    const description = values.seo_description || 'The Youth Development Program (YDP) is a national initiative dedicated to empowering the youth of Pakistan through education, leadership, and skill development.';
    const image = values.seo_og_image || '/images/og-image.jpg';
    return { 
      title: { template: `%s | ${values.site_name || 'Youth Development Program (YDP)'}`, default: title }, 
      description, 
      keywords: values.seo_keywords ? values.seo_keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean) : undefined, 
      icons: values.site_favicon ? { icon: values.site_favicon } : undefined, 
      openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }] }, 
      twitter: { title, description, images: [image] } 
    };
  } catch {
    return {};
  }
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
