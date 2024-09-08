import Link from "next/link";
import { LayoutDashboard, Star, Archive, Trash2, Folder } from "lucide-react";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    count?: number;
    href?: string;
}

const SidebarItem = ({ icon: Icon, label, count, href = "#" }: SidebarItemProps) => (
    <Link href={href} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
        <Icon size={18} className="text-blue-400" fill="currentColor" />
        <span>{label}</span>
        {count && <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">{count}</span>}
    </Link>
);

const Sidebar = () => {
    return (
        <div className="w-64 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-2">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/designer" />
                <SidebarItem icon={Star} label="Starred" count={31} />
                <SidebarItem icon={Archive} label="Archive" count={216} />
                <SidebarItem icon={Trash2} label="Deleted" count={12} />
            </div>
            <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wyvern&apos;s Nest</h3>
                <div className="mt-2 space-y-1">
                    <SidebarItem icon={Folder} label="The Tidings" count={200} />
                    <SidebarItem icon={Folder} label="The Tidings" count={200} />
                    <div className="ml-4 space-y-1">
                        <SidebarItem icon={Folder} label="Chapter 1" count={50} />
                        <SidebarItem icon={Folder} label="Chapter 2" count={75} />
                        <SidebarItem icon={Folder} label="Chapter 3" count={75} />
                    </div>
                    <SidebarItem icon={Folder} label="Dragonfire Chronicles" count={150} />
                    <div className="ml-4 space-y-1">
                        <SidebarItem icon={Folder} label="Book 1" count={50} />
                        <SidebarItem icon={Folder} label="Book 2" count={100} />
                    </div>
                    <SidebarItem icon={Folder} label="Out of the Ashes" count={12} />
                </div>
            </div>
            <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vault</h3>
                <div className="mt-2 space-y-1">
                    <SidebarItem icon={Folder} label="All Notes" count={200} />
                    <SidebarItem icon={Folder} label="Articles" count={12} />
                    <SidebarItem icon={Folder} label="Recipes" count={12} />
                    <SidebarItem icon={Folder} label="Inspiration" count={12} />
                    <SidebarItem icon={Folder} label="Workouts" count={12} />
                    <SidebarItem icon={Folder} label="Content Ideas" count={12} />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;