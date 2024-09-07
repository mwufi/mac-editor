import Link from "next/link";
import { LayoutDashboard, Star, Archive, Trash2, Folder } from "lucide-react";

const SidebarItem = ({ icon: Icon, label, count, href = "#" }) => (
  <Link href={href} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
    <Icon size={18} />
    <span>{label}</span>
    {count && <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">{count}</span>}
  </Link>
);

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-2">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem icon={Star} label="Starred" count={31} />
        <SidebarItem icon={Archive} label="Archive" />
        <SidebarItem icon={Trash2} label="Deleted" />
      </div>
      <div className="mt-8">
        <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vault</h3>
        <div className="mt-2 space-y-1">
          <SidebarItem icon={Folder} label="Work" count={5} />
          <SidebarItem icon={Folder} label="Personal" count={3} />
          <SidebarItem icon={Folder} label="Travel" count={2} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;