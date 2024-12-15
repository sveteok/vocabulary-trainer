import { bottomNavigationActionType } from "@/app/ui/basis/bottomNavigation";
import BottomActions from "@/app/ui/basis/bottomActions";

export default function MainContainer({
  className,
  children,
  actions,
  handleOnChange,
}: {
  className?: string;
  children: React.ReactNode;
  actions: bottomNavigationActionType[];
  value?: number | string;
  handleOnChange: (newValue: number | string) => void;
}) {
  return (
    <>
      <div
        className={`flex-1 flex flex-col items-stretch p-4 overflow-y-scroll gap-4 bg-[#dcd5cd] text-[#232a32] ${className}`}
      >
        {children}
      </div>
      <BottomActions actions={actions} handleOnChange={handleOnChange} />
    </>
  );
}
