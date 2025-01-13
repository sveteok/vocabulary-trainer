"use client";

import { useEffect, useContext } from "react";

import { CategoryProps } from "@/lib/definitions";
import { DictionaryContext } from "@/store/dict-context";

export function CategoryWrapper({
  localizedCategories,
  children,
}: {
  localizedCategories: CategoryProps[];
  children: React.ReactNode;
}) {
  const dictContext = useContext(DictionaryContext);
  const { form, feedLocalizedCategories } = dictContext;

  useEffect(() => {
    feedLocalizedCategories(localizedCategories);
  }, [form.category]);

  return <>{children}</>;
}
