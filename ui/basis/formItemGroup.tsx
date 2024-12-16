import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";

import { lusitana } from "@/ui/fonts";

import { KeyValueObjectType } from "@/lib/definitions";

export default function FormItemGroup(props: {
  label?: string;
  name: string;
  h1?: string;
  items?: KeyValueObjectType[];
  noItemsMessage?: string;
  value?: string;
  handleChange?: (field_name: string, value: string, label: string) => void;
}) {
  const {
    label,
    name,
    h1,
    items,
    value,
    noItemsMessage = "No Items",
    handleChange = (field_name: string, value: string, label: string) => {},
  } = props;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const item = items?.find((e) => e.id === value);
    if (item) handleChange(name, value, item.name);
  };

  if (items?.length === 0) {
    return <p>{noItemsMessage}</p>;
  }

  return (
    <FormControl>
      {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
      {h1 && <h1 className={`${lusitana.className} text-xl`}>{h1}</h1>}
      <RadioGroup
        id={`${name}-label`}
        aria-labelledby={`${name}-label`}
        name={name}
        defaultValue={value || items?.[0].id}
        value={value || items?.[0].id}
        onChange={handleOnChange}
      >
        {items?.map((item: KeyValueObjectType) => {
          return (
            <FormControlLabel
              checked={item.id == value}
              key={item.id}
              value={item.id}
              label={<span className="flex row-auto ">{item.name}</span>}
              control={
                <Radio
                  sx={{
                    color: "#87837e",
                    "&.Mui-checked": {
                      color: "#87837e",
                    },
                  }}
                />
              }
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
