"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import FormItemGroup from "@/ui/basis/formItemGroup";
import MainContainer from "@/ui/basis/mainContainer";
import SubMenu from "@/ui/basis/subMenu";

import { useTranslatedLanguage } from "@/hooks/useTranslatedLanguage";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";

export default function LangToPage() {
  const { form, onNextPageHandler, updateDataById } = useTranslatedLanguage();

  return (
    <>
      <SubMenu>
        <div className="pl-3">
          {form.language && form.localization.select_language ? (
            form.localization?.select_language + "..."
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      </SubMenu>

      <MainContainer
        actions={[
          {
            label: (form.language && form.localization.next_page) || "",
            icon: <NavigateNextRoundedIcon />,
            id: "next",
            disabled: !form.language,
          },
        ]}
        value="next"
        handleOnChange={onNextPageHandler}
      >
        <section aria-label="Select Language">
          <FormItemGroup
            name="translation_language"
            items={form.localizedLanguages}
            noItemsMessage="No languages"
            value={form.translation_language}
            handleChange={updateDataById}
          />
        </section>
      </MainContainer>
    </>
  );
}
