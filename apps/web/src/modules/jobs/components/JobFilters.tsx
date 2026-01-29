'use client';

import { useState, useEffect } from 'react';

interface FilterState {
  search: string;
  type: string;
  level: string;
}

interface JobFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export default function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    level: '',
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleTypeFilter = (type: string) => {
    // Type update should be immediate for better UX (or could be debounced if strictly consistent)
    // Here we update state, effect triggers onFilterChange
    setFilters(prev => ({ ...prev, type }));
  };

  const handleLevelFilter = (level: string) => {
    setFilters(prev => ({ ...prev, level }));
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Search */}
      <div className="col-span-full md:col-span-2">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Buscar</span>
          </div>
          <input
            type="text"
            placeholder="Busca por título, empresa o tecnología..."
            className="input input-bordered w-full"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Type Filter */}
      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Tipo</span>
          </div>
          <select
            className="select select-bordered"
            value={filters.type}
            onChange={(e) => handleTypeFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contrato</option>
            <option value="freelance">Freelance</option>
          </select>
        </label>
      </div>

      {/* Level Filter */}
      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Nivel</span>
          </div>
          <select
            className="select select-bordered"
            value={filters.level}
            onChange={(e) => handleLevelFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </label>
      </div>
    </div>
  );
}
