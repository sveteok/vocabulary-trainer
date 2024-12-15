"use client";

import React, { useContext } from "react";

import { DictionaryContext } from "@/store/dict-context";
import Card from "@/app/ui/basis/card";

const GameOver = ({ info }: { info?: string }) => {
  const dictContext = useContext(DictionaryContext);
  const { form } = dictContext;

  return (
    <Card
      id="done"
      name={
        info ||
        form.localization?.well_done_all_learned ||
        "Well done! All words have been learned!"
      }
      hideDetails={true}
    />
  );
};

export default GameOver;
