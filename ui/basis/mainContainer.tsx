import BottomActions, { bottomActionsType } from "@/ui/basis/bottomActions";

export default function MainContainer({
  className,
  children,
  actions,
  handleOnChange,
}: {
  className?: string;
  children: React.ReactNode;
  actions: bottomActionsType[];
  value?: number | string;
  handleOnChange: (newValue: number | string) => void;
}) {
  return (
    <>
      <main
        role="main"
        className={`flex-1 flex flex-col items-stretch p-4 overflow-y-scroll gap-4 bg-[#dcd5cd] text-[#232a32] ${className}`}
      >
        {children}
      </main>
      <BottomActions actions={actions} handleOnChange={handleOnChange} />
    </>
  );
}
