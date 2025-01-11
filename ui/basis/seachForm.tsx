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
      className="flex flex-1 items-center col-span-2 justify-items-stretch py-2 px-1"
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
        className="py-2 px-4 w-full 
                border-natural-gray-300
                bg-natural-gray-50
                focus:ring-1 focus:outline-natural-gray-100
                rounded-md border-2 gap-2
                
               
            "
        required={true}
        aria-describedby="filter words"
        autoFocus
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon
          style={{ fill: "var(--data-color)" }}
          className="data-color:color-natural-gray-700"
          data-color
        />
      </IconButton>
    </form>
  );
};

export default SeachForm;
