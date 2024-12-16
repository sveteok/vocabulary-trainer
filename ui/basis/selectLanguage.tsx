"use client";
import { useContext } from "react";

import { DictionaryContext } from "@/store/dict-context";

import RunningLine from "@/ui/basis/runningLine";

export default function SelectLanguage() {
  const dictContext = useContext(DictionaryContext);
  const { form } = dictContext;

  let textArr = form.languages.map((l) => {
    let select_language =
      form.allLocalization?.[l.id]?.select_application_language;

    if (select_language) return select_language + "...";
    else return l.name;
  });

  return (
    <RunningLine>
      {textArr.map((item) => (
        <p key={item} className="mr-10">
          {item}
        </p>
      ))}
    </RunningLine>
  );
}
