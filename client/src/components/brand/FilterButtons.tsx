import React from "react";
import { Link } from "react-router-dom";

type Tab = { label: string; href: string };

interface FilterButtonsProps {
  tabs: Tab[];
  selectedTab: string;
  onSelect: (label: string) => void;
  tabBg?: string;
  tabActive?: string;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  tabs,
  selectedTab,
  onSelect,
  tabBg = "bg-white/80 backdrop-blur",
  tabActive = "bg-black text-white",
}) => {
  if (!tabs?.length) return null;

  return (
    <nav className={`ml-auto rounded-xl ${tabBg} p-1 flex gap-1`}>
      {tabs.map((t) => {
        const isActive = selectedTab === t.label;
        return (
          <Link
            key={t.label}
            to={t.href}
            onClick={(e) => { e.preventDefault(); onSelect(t.label); }}
            aria-current={isActive ? "page" : undefined}
            className={[
              "px-4 py-2 rounded-lg justify-center flex items-center text-sm font-medium transition-colors",
              isActive ? tabActive : "hover:bg-black/10",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
};
