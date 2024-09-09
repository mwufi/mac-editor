import React from 'react';
import Link from 'next/link';
import { Compass, Paintbrush, Image, MessageCircle, ThumbsUp, User, HelpCircle, Bell, Sun, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, text }) => (
  <Link href={href} className="flex relative hover:z-[var(--dynamic-z)] w-full group min-w-fit items-center gap-2 rounded-full bg-light-bg dark:bg-dark-bg p-2 text-light-primary dark:text-dark-primary">
    <div className="absolute inset-0 rounded-full buttonGroupHoverOpacity buttonGroupActiveOpacity buttonGroupActiveBackground buttonGroupHoverBackground ring-inset group-hover:ring-1 group-active:shadow-inner ring-light-200/50 dark:ring-dark-700/50"></div>
    <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-light-bg/50 dark:from-dark-bg/20 transition duration-200 ease-in-out hidden group-hover:flex dark:!hidden"></div>
    {icon}
    <p className="relative truncate text-sm font-semibold">{text}</p>
  </Link>
);

const Nav: React.FC = () => (
  <nav className="sticky hover:z-[var(--dynamic-z)] top-0 flex h-screen shrink-0 bottom-0 pt-5 flex-col items-center justify-between gap-4 overflow-visible ease-out" style={{ width: "214px", paddingLeft: "22px", paddingRight: "32px", paddingBottom: "calc(20px + env(safe-area-inset-bottom))", "--dynamic-z": 3 }}>
    <div className="flex w-full grow select-none flex-col items-start gap-3 whitespace-nowrap text-base text-light-primary dark:text-dark-primary">
      <Link href="/explore?tab=top" className="flex w-full relative items-center overflow-hidden pl-1.5 text-lg font-medium tracking-wide" style={{ height: "54px" }}>Midjourney</Link>
      <NavLink href="/explore?tab=top" icon={<Compass size={22} />} text="Explore" />
      <NavLink href="/imagine" icon={<Paintbrush size={22} />} text="Create" />
      <NavLink href="/archive" icon={<Image size={22} />} text="Organize" />
      <NavLink href="/rooms/09ef7297-15ad-4cbc-a958-6bcdca8d181b" icon={<MessageCircle size={22} />} text="Chat" />
      <NavLink href="/tasks" icon={<ThumbsUp size={22} />} text="Tasks" />
      <NavLink href="/account" icon={<User size={22} />} text="Subscribe" />
    </div>
    <div className="flex w-full grow flex-col justify-end">
      <div className="flex w-full flex-col items-start justify-end gap-3.5">
        <div className="flex gap-2.5 flex-col w-full justify-between items-start" style={{ paddingLeft: "7px" }}>
          <NavLink href="/help" icon={<HelpCircle size={24} />} text="Help" />
          <NavLink href="/updates" icon={<Bell size={24} />} text="Updates" />
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Sun className="mr-2 h-4 w-4" />
            Light Mode
          </Button>
        </div>
        <ProfileMenu />
      </div>
    </div>
  </nav>
);

const ProfileMenu: React.FC = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full justify-between">
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          <span>sdf3926</span>
        </div>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuItem>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default Nav;