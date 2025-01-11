"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { CategoryProps } from "@/lib/definitions";

import { DictionaryContext } from "@/store/dict-context";
import FormItemGroup from "@/ui/basis/formItemGroup";
import MainContainer from "@/ui/basis/mainContainer";
import SubMenu from "@/ui/basis/subMenu";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";

export default function Category({
  localizedCategories,
}: {
  localizedCategories: CategoryProps[];
}) {
  const router = useRouter();

  const dictContext = useContext(DictionaryContext);
  const { form, updateDataById, feedLocalizedCategories } = dictContext;

  const [categories, setCategories] =
    useState<CategoryProps[]>(localizedCategories);

  useEffect(() => {
    if (!form.category) updateDataById("category", form.categories[0].id);

    setCategories(localizedCategories);
    feedLocalizedCategories(localizedCategories);
  }, [form.category]);

  return (
    <>
      <SubMenu>
        <div className="pl-3">
          {(form.language &&
            form.translation_language &&
            form.localization?.choose_category + "...") || <LoadingSkeleton />}
        </div>
      </SubMenu>
      <MainContainer
        actions={[
          {
            label:
              (form.language &&
                form.translation_language &&
                form.localization?.next_page) ||
              "",
            icon: <NavigateNextRoundedIcon />,
            id: "next",
          },
        ]}
        value="next"
        handleOnChange={() => {
          if (form.category)
            router.push(
              `/${form.language}/${form.translation_language}/${form.category}`
            );
        }}
      >
        <section
          aria-label={form.localization?.choose_category || "Choose category"}
        >
          <FormItemGroup
            name="category"
            items={categories}
            noItemsMessage="No categories"
            value={form.category || form.categories[0].id}
            handleChange={updateDataById}
          />
        </section>
      </MainContainer>
    </>
  );
}
