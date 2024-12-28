import { lusitana } from "@/ui/fonts";

import { useEffect, useState } from "react";

import InfoContainer, { InfoContainerStates } from "@/ui/basis/infoContainer";

import { KeyValueObjectType } from "@/lib/definitions";

export interface RadioGroupType {
  id: string;
  name: string;
}

type RadioGroupProps = {
  name: string;
  value?: string;
  options?: KeyValueObjectType[];
  correctAnswerId?: string;
  onSelect?: (value: string) => void;
  headText?: string;
  isNextBtnDisabled?: boolean;
};

export default function QuizeRadioGroup(props: RadioGroupProps) {
  const {
    name,
    options,
    correctAnswerId,
    value,
    onSelect = (value: string) => {},
    headText,
    isNextBtnDisabled,
  } = props;

  const [groupOptions, setGroupOptions] = useState<RadioGroupType[]>(
    fillGroupOptions(options)
  );
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );

  useKeyDown(
    (e) => {
      if (onSelect === undefined) return;

      if (
        (e.key === "Enter" || e.code === "Space") &&
        focusedElement !== null
      ) {
        focusedElement.click();
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        const option: RadioGroupType = groupOptions[parseInt(e.key) - 1];
        onSelect(option.id);
      }
    },
    [groupOptions, focusedElement]
  );

  useEffect(() => {
    setGroupOptions(fillGroupOptions(options));
    setFocusedElement(null);
  }, [options]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value);
  };

  return (
    <div className="flex flex-col w-full text-[#232a32]">
      <h1 className={`${lusitana.className} text-sm p-2 mt-2`}>
        {headText || "Select the correct translation"}
      </h1>
      {groupOptions.map((option, index) => (
        <div key={`${option.id}`} id={`toggle_button_${option.id}`}>
          <input
            name="quize_radio_group"
            key={`radio_group_option_${option.id}`}
            type="radio"
            id={`radio_group_option_${option.id}`}
            aria-labelledby={`${name}-toggle-button-group`}
            value={option.id}
            checked={value === option.id}
            onChange={handleOptionChange}
            hidden
          />
          <label
            htmlFor={`radio_group_option_${option.id}`}
            key={`radio_group_option_label_${option.id}`}
            tabIndex={isNextBtnDisabled ? 0 : -1}
            onFocus={(e) => {
              if (!isNextBtnDisabled) e.preventDefault();
              setFocusedElement(
                document.getElementById(`radio_group_option_${option.id}`)
              );
            }}
          >
            <InfoContainer
              id={option.id}
              infoState={
                value && value == option.id && value !== correctAnswerId
                  ? InfoContainerStates.ERROR
                  : value && option.id == correctAnswerId
                  ? InfoContainerStates.CORRECT
                  : InfoContainerStates.INFO
              }
              rippleEffectDisabled={value !== undefined && value?.length > 0}
            >
              {index + 1}. {option.name}
            </InfoContainer>
          </label>
        </div>
      ))}
    </div>
  );
}

const fillGroupOptions = (data?: RadioGroupType[]) => {
  const options = data ? [...data] : [];
  const length = data ? 4 - data.length : 4;
  for (var i = 0; i < length; i++) {
    options.push({ id: `o_${i}`, name: "\u00A0" });
  }
  return options;
};

const useKeyDown = (
  handler: (this: Document, ev: KeyboardEvent) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    document.addEventListener("keyup", handler);

    return () => {
      document.removeEventListener("keyup", handler);
    };
  }, deps);
};
