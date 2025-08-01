"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagFilterDropdownProps {
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function TagFilterDropdown({ allTags, selectedTags, onTagToggle }: TagFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-neutral-800 border border-neutral-700 rounded-lg flex flex-wrap gap-2 items-center min-h-[44px] w-full text-left"
      >
        {selectedTags.length === 0 && <span className="text-neutral-500 px-2">Wybierz tagi...</span>}
        {selectedTags.map(tag => (
          <div key={tag} className="bg-accent text-black text-sm px-2 py-1 rounded-md flex items-center gap-1">
            <span>{tag}</span>
            <button onClick={(e) => { e.stopPropagation(); onTagToggle(tag); }}><X size={14} /></button>
          </div>
        ))}
        <ChevronDown size={16} className={`ml-auto text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 p-2 grid grid-cols-2 gap-2"
          >
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`w-full text-left text-sm p-2 rounded-md ${selectedTags.includes(tag) ? 'bg-accent text-black' : 'hover:bg-neutral-700'}`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
