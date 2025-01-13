import { Suspense } from "react";
import { notFound } from "next/navigation";

import { fetchAllCategories } from "@/lib/data";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";
import { CategoryWrapper } from "@/ui/basis/categoryWrapper";

export default async function CategoryLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    lang_from: string;
    lang_to: string;
    cat_id: string;
  }>;
}>) {
  const { lang_from } = await params;

  const localizedCategories = await fetchAllCategories(lang_from);

  if (!localizedCategories) {
    return notFound();
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CategoryWrapper localizedCategories={localizedCategories}>
        {children}
      </CategoryWrapper>
    </Suspense>
  );
}
