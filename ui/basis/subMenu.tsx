export default function SubMenu({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-natural-gray-100 text-natural-gray-800 p-4">
      {children}
    </div>
  );
}
