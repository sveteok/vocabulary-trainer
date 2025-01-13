"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import FormItemGroup from "@/ui/basis/formItemGroup";
import MainContainer from "@/ui/basis/mainContainer";
import SubMenu from "@/ui/basis/subMenu";

import { useTranslatedLanguage } from "@/hooks/useTranslatedLanguage";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";

export default function LangToPage() {
  const {
    localization,
    localizedLanguages,
    lang_to,
    onNextPageHandler,
    updateDataById,
  } = useTranslatedLanguage();

  return (
    <>
      <SubMenu>
        <div className="pl-3">
          {lang_to && localization.select_language ? (
            localization?.select_language + "..."
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      </SubMenu>

      <MainContainer
        actions={[
          {
            label: (lang_to && localization.next_page) || "",
            icon: <NavigateNextRoundedIcon />,
            id: "next",
            disabled: !lang_to,
          },
        ]}
        value="next"
        handleOnChange={onNextPageHandler}
      >
        <section aria-label="Select Language">
          <FormItemGroup
            name="translation_language"
            items={localizedLanguages}
            noItemsMessage="No languages"
            value={lang_to}
            handleChange={updateDataById}
          />
        </section>
      </MainContainer>
    </>
  );
}
