"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import FormItemGroup from "@/ui/basis/formItemGroup";
import MainContainer from "@/ui/basis/mainContainer";
import SubMenu from "@/ui/basis/subMenu";

import { useTranslatedLanguage } from "@/hooks/useTranslatedLanguage";

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
          {(localization.select_language || "Select Language") + "..."}
        </div>
      </SubMenu>

      <MainContainer
        actions={[
          {
            label: localization.next_page || "Next",
            icon: <NavigateNextRoundedIcon />,
            id: "next",
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
