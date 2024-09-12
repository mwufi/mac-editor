
const HeaderToolbar = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div data-tauri-drag-region className={`h-12 py-2 flex items-center px-4 ${className}`}>
      {children}
    </div>
  );
}

export default HeaderToolbar;
