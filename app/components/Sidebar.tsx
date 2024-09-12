import Link from "next/link";
import { LayoutDashboard, Star, Archive, Trash2, Folder } from "lucide-react";
import { collectionsAtom, selectedCollectionIdAtom, sidebarOpenAtom } from "../atoms";
import { useAtom, useAtomValue } from "jotai";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    count?: number;
    href?: string;
    onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, count, href = "#", onClick }: SidebarItemProps) => (
    <Link href={href} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md" onClick={onClick}>
        <Icon size={18} className="text-red-400" fill="currentColor" />
        <span>{label}</span>
        {count && <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">{count}</span>}
    </Link>
);

const Book = () => (
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
)



const Sidebar = () => {
    const [collections] = useAtom(collectionsAtom);
    const [, setSelectedCollectionId] = useAtom(selectedCollectionIdAtom);
    const sidebarOpen = useAtomValue(sidebarOpenAtom);

    return (
        <div className={`shrink-0 ${!sidebarOpen && "fixed"} h-full overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4`}>
            <div className="pt-10" data-tauri-drag-region>
            </div>
            <div className="space-y-2">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/test/layout" />
                <SidebarItem icon={Star} label="Starred" count={31} />
                <SidebarItem icon={Archive} label="Archive" count={216} />
                <SidebarItem icon={Trash2} label="Deleted" count={12} />
            </div>
            <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</h3>
                <div className="mt-2 space-y-1">
                    <SidebarItem icon={Trash2} label="Test dialog" count={12} href="/test/dialog" />
                    <SidebarItem icon={Trash2} label="Test database" count={12} href="/test/database" />
                </div>
            </div>
            <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vault</h3>
                <div className="mt-2 space-y-1">
                    {collections.map((collection) => (
                        <SidebarItem
                            key={collection.id}
                            icon={Folder}
                            label={collection.name}
                            count={collection.note_count}
                            onClick={() => setSelectedCollectionId(collection.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;