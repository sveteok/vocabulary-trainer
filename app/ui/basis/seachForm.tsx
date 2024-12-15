import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SeachForm = ({
  onUpdateFilterInputHandler,
  seachText,
  placeholderText,
}: {
  onUpdateFilterInputHandler: (seachText: string) => void;
  seachText: string;
  placeholderText?: string;
}) => {
  return (
    <form
      className="flex flex-1 items-center col-span-2 justify-items-stretch"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const value = (
          e.currentTarget.elements.namedItem("search-bar") as HTMLInputElement
        ).value;

        onUpdateFilterInputHandler(value.toLowerCase());
      }}
    >
      <input
        type="text"
        id="search-bar"
        name="search-bar"
        value={seachText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onUpdateFilterInputHandler(e.target.value.toLowerCase());
        }}
        autoComplete="off"
        placeholder={placeholderText || ""}
        className="py-2 px-4 w-full bg-gray-50 
            rounded-md border-2 border-[#87837e] focus:ring-[#87837e] focus:border-[#87837e] outline-none  gap-2"
        required={true}
        aria-describedby="filter words"
        autoFocus
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "#87837e" }} />
      </IconButton>
    </form>
  );
};

export default SeachForm;
