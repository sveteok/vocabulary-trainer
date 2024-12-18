export default function SubMenu({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-[#d5cddc]  py-5 px-1 max-h-[60px] text-[#32232a]">
      {children}
    </div>
  );
}
