import { Suspense } from "react";

import Category from "@/app/ui/category/category";

import { fetchAllCategories } from "@/app/lib/data";

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
    return "Failed to fetch data!!!.";
  }

  const localizedCategories = await fetchAllCategories(lang_from);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Category localizedCategories={localizedCategories} />
    </Suspense>
  );
}
