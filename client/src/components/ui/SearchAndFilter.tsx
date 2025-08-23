import React from "react";
import CustomSelect, { type Option } from "../ui/CustomSelect";
import { FiSearch } from "react-icons/fi";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  brandFilter: string;
  setBrandFilter: React.Dispatch<React.SetStateAction<string>>;
  brandOptions: Option[];
}

export default function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  brandFilter,
  setBrandFilter,
  brandOptions,
}: SearchAndFilterProps) {
  return (
    <div className="bg-primary bg-opacity-40 p-6 rounded-lg shadow-lg max-w-">
      <div className="flex flex-wrap gap-4 items-center justify-between sm:justify-start">
        {/* Поиск */}
        <div className="relative w-full sm:w-[320px] lg:w-[600px]">
          <input
            type="text"
            placeholder="Search by model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 pl-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <FiSearch size={20} />
          </span>
        </div>

        {/* Фильтр бренда */}
        <CustomSelect
          options={brandOptions}
          value={brandFilter}
          onChange={setBrandFilter}
          className="max-w-[220px] sm:max-w-[200px] w-full bg-white rounded-full"
        />
      </div>
    </div>
  );
}
