"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { DictionaryContext } from "@/store/dict-context";
import FormItemGroup from "@/app/ui/basis/formItemGroup";
import MainContainer from "@/app/ui/basis/mainContainer";
import SelectLanguage from "@/app/ui/basis/selectLanguage";
import SubMenu from "@/app/ui/basis/sub-menu";

export default function LangFromPage() {
  const router = useRouter();

  const dictContext = useContext(DictionaryContext);
  const { form, updateDataById } = dictContext;

  useEffect(() => {
    if (!form.language) updateDataById("language", "en");
  }, [form.language, updateDataById]);

  return (
    <>
      <SubMenu>
        <SelectLanguage />
      </SubMenu>
      <MainContainer
        actions={[
          {
            label: form.localization.next_page || "Next",
            icon: <NavigateNextRoundedIcon />,
            id: "next",
          },
        ]}
        value="next"
        handleOnChange={() => {
          if (form.language) router.push(`/${form.language}`);
        }}
      >
        <section
          aria-label={
            form.localization.select_application_language || "Select Language"
          }
        >
          <FormItemGroup
            name="language"
            items={form.languages}
            noItemsMessage="No languages"
            value={form.language}
            handleChange={updateDataById}
          />
        </section>
      </MainContainer>
    </>
  );
}
