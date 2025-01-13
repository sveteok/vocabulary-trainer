"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { DictionaryContext } from "@/store/dict-context";
import FormItemGroup from "@/ui/basis/formItemGroup";
import MainContainer from "@/ui/basis/mainContainer";
import SubMenu from "@/ui/basis/subMenu";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";

export function Category() {
  const router = useRouter();

  const dictContext = useContext(DictionaryContext);
  const { form, updateDataById } = dictContext;

  useEffect(() => {
    if (!form.category) {
      updateDataById("category", form.localizedCategories?.[0].id || "");
    }
  }, []);

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
            disabled: !form.category,
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
            items={form.localizedCategories}
            noItemsMessage="No categories"
            value={form.category}
            handleChange={updateDataById}
          />
        </section>
      </MainContainer>
    </>
  );
}
