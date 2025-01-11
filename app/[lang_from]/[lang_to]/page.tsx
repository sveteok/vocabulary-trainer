import { Suspense } from "react";
import { notFound } from "next/navigation";

import Category from "@/ui/basis/category";

import { fetchAllCategories } from "@/lib/data";

export default async function CategoryListPage({
  params,
}: {
  params: Promise<{
    lang_from: string;
    lang_to: string;
  }>;
}) {
  const { lang_from, lang_to } = await params;

  if (!lang_from || !lang_to) {
    return notFound();
  }

  const localizedCategories = await fetchAllCategories(lang_from);

  if (!localizedCategories) {
    return notFound();
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Category localizedCategories={localizedCategories} />
    </Suspense>
  );
}
