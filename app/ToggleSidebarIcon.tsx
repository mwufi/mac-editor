"use client";

import { useAtom } from "jotai";
import { sidebarOpenAtom } from "./atoms";
import { PanelRight } from "lucide-react";

export default function ToggleSidebarIcon() {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  return (
    <div className={`fixed top-4 left-20 z-50 flex items-center transition-all duration-300`}>
      <PanelRight className="h-6 w-6 text-yellow-500" onClick={() => setSidebarOpen(!sidebarOpen)}/>
    </div>
  )
}