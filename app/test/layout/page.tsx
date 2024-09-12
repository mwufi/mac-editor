'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const items = [
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    { id: 3, content: 'Item 3' },
    { id: 4, content: 'Item 4' },
    { id: 5, content: 'Item 5' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "230px" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 overflow-y-auto flex flex-col"
          >
            {/* Sidebar header */}
            <div data-tauri-drag-region className="pl-20 py-2 border-b border-gray-200 flex items-center px-4">
              <Button
                onClick={toggleSidebar}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            {/* Sidebar content */}
            <div className="p-4 flex-grow">Sidebar Content</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-grow">
        <div className="flex-grow flex overflow-hidden">
          <motion.div
            layout
            className="w-[300px] bg-white overflow-y-auto flex flex-col"
            transition={{ duration: 0.3 }}
          >
            {/* Second column header */}
            <div data-tauri-drag-region className={`py-2 border-b border-gray-200 flex items-center justify-between px-4 ${sidebarOpen ? "" : "pl-20"}`}>
              <div className="flex space-x-2 items-center">
                {!sidebarOpen && (
                  <Button
                    onClick={toggleSidebar}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ChevronRight size={16} />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Pencil size={16} className="text-gray-600 cursor-pointer" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Trash2 size={16} className="text-gray-600 cursor-pointer" />
                </Button>
              </div>
            </div>
            {/* Second column content */}
            <div className="p-4">Second Column Content</div>
            {items.map((item) => (
              <div className="px-2">
                <div
                  key={item.id}
                  className="relative p-4 cursor-pointer"
                  onClick={() => setSelectedItem(item.id)}
                >
                  <AnimatePresence>
                    {selectedItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 bg-pink-200 rounded-md"
                      />
                    )}
                  </AnimatePresence>
                  <p className="relative z-10">{item.content}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            layout
            className="flex-1 bg-gray-50 overflow-y-auto flex flex-col"
            transition={{ duration: 0.3 }}
          >
            {/* Third column header */}
            <div className="pl-20 py-2 border-b border-gray-200 flex items-center px-4">
              Third Column Header
            </div>
            {/* Third column content */}
            <div className="p-4 flex-grow">Third Column Content</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
