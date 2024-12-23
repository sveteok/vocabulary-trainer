"use client";

import React, { useContext } from "react";

import { useRouter, usePathname } from "next/navigation";

import { DictionaryContext } from "@/store/dict-context";

export default function MenuPage() {
  const dictContext = useContext(DictionaryContext);
  const { form } = dictContext;

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-1 dbg-[#cdf9f3]">
      <nav className="grid grid-cols-2 justify-items-center float-start row-span-0 flex-1 gap-2 items-center m-0 ">
        <MenuButton
          label={form.localization?.cards || "Cards"}
          onClick={() => router.push(`${pathname}/../cards`)}
        />
        <MenuButton
          label={form.localization?.match || "Match"}
          onClick={() => router.push(`${pathname}/../match`)}
        />
        <MenuButton
          label={form.localization?.quize || "Quize"}
          onClick={() => router.push(`${pathname}/../quize`)}
        />
        <MenuButton
          label={form.localization?.write || "Write"}
          onClick={() => router.push(`${pathname}/../write`)}
        />
      </nav>
    </div>
  );
}

type MenuButtonProps = {
  label: string;
  onClick: () => void;
};
const MenuButton = (props: MenuButtonProps) => {
  const { label, onClick } = props;

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-center m-2 p-2 h-[150px] w-[150px] hover:animate-button-effect-active
border-2 border-[#32302f] rounded-full 
      bg-[#87837e] text-[#fff]
      hover:border-[#414f4d]
      hover:text-[#414f4d]
      hover:bg-[#d5cddc]
       active:bg-[#87837e] active:text-[#fff]
      disabled:bg-gray-300
      disabled:opacity-25
      disabled:focus:opacity-0
      disabled:active:none`}
    >
      {label}
    </button>
  );
};
