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
    selected?: boolean;
}

const SidebarItem = ({ icon: Icon, label, count, href = "#", onClick, selected }: SidebarItemProps) => {
    return (
        <div className="relative group">
            <Link href={href} className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md ${selected ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={onClick}>
                <Icon size={18} className="text-accent" fill="currentColor" />
                <span className="flex-grow">{label}</span>
                {count !== undefined && <span className="bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">{count}</span>}
            </Link>
        </div>
    );
};

const Sidebar = () => {
    const [collections] = useAtom(collectionsAtom);
    const [selectedCollectionId, setSelectedCollectionId] = useAtom(selectedCollectionIdAtom);
    const sidebarOpen = useAtomValue(sidebarOpenAtom);

    return (
        <div className={`shrink-0 ${!sidebarOpen && "fixed"} h-full overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2`}>
            <div className="">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/test/layout" />
                <SidebarItem icon={Star} label="Starred" count={31} />
                <SidebarItem icon={Archive} label="Archive" count={216} />
                <SidebarItem icon={Trash2} label="Deleted" count={12} />
            </div>
            <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</h3>
                <div className="mt-2 ">
                    <SidebarItem icon={Trash2} label="Test dialog" count={12} href="/test/dialog" />
                    <SidebarItem icon={Trash2} label="Test database" count={12} href="/test/database" />
                </div>
            </div>
            <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vault</h3>
                <div className="mt-2 ">
                    {collections.map((collection) => (
                        <SidebarItem
                            key={collection.id}
                            icon={Folder}
                            selected={collection.id === selectedCollectionId}
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