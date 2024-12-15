"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { CategoryProps } from "@/app/lib/definitions";

import { DictionaryContext } from "@/store/dict-context";
import FormItemGroup from "@/app/ui/basis/formItemGroup";
import MainContainer from "@/app/ui/basis/mainContainer";
import SubMenu from "@/app/ui/basis/sub-menu";

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

  //const localization = form.localization?.[`${form.language}`];

  const chooseCategoryText =
    (form.localization?.choose_category || "Choose category") + "...";

  return (
    <>
      <SubMenu>
        <div className="pl-3">{chooseCategoryText}</div>
      </SubMenu>
      <MainContainer
        actions={[
          {
            label: form.localization?.next_page || "Next",
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
        <section aria-label={chooseCategoryText}>
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
