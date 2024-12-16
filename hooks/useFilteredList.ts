import { useState, SetStateAction } from "react";

import { WordPairsProp } from "@/lib/definitions";

interface FilteredListDataProp {
  seachText: string;
  filteredList: WordPairsProp[];
  canSelectMoreWords: boolean;
  setSeachText: React.Dispatch<SetStateAction<string>>;
}

export function useFilteredList({
  list,
  maxNumToSelect,
}: {
  list: WordPairsProp[];
  maxNumToSelect?: number;
}): FilteredListDataProp {
  const [seachText, setSeachText] = useState<string>("");

  const filteredList = list.filter((el) => {
    if (seachText === "") {
      return el;
    } else {
      return (
        el.word_name.toLowerCase().includes(seachText) ||
        el.translated_word_name.toLowerCase().includes(seachText)
      );
    }
  });

  const canSelectMoreWords = () => {
    if (maxNumToSelect === undefined) return true;
    const checkedNumber =
      list.reduce((count, el) => {
        return el.selected ? count + 1 : count;
      }, 0) || 0;

    return checkedNumber < maxNumToSelect;
  };

  return {
    seachText,
    setSeachText,
    filteredList,
    canSelectMoreWords: canSelectMoreWords(),
  };
}
