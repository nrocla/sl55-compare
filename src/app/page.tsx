"use client";
import { useEffect, useMemo, useState } from "react";
import { Filters, FiltersState } from "@/components/Filters";
import { Listing } from "@/types/listing";
import { ListingCard } from "@/components/ListingCard";
import { CompareBar } from "@/components/CompareBar";
import { CompareTable } from "@/components/CompareTable";

export default function Home() {
  const [filters, setFilters] = useState<FiltersState>({
    conditions: { new: true, used: true, certified: true },
    minYear: 2002,
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const conditionParams = useMemo(() => {
    const arr: string[] = [];
    if (filters.conditions.new) arr.push("condition=new");
    if (filters.conditions.used) arr.push("condition=used");
    if (filters.conditions.certified) arr.push("condition=certified");
    return arr.join("&");
  }, [filters.conditions]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("q", "SL55 AMG");
    if (filters.minYear) params.set("minYear", String(filters.minYear));
    if (filters.maxYear) params.set("maxYear", String(filters.maxYear));
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (typeof filters.maxMileage === "number") params.set("maxMileage", String(filters.maxMileage));
    setLoading(true);
    fetch(`/api/listings?${conditionParams}${conditionParams ? "&" : ""}${params.toString()}`)
      .then(r => r.json())
      .then(d => setListings(d.results as Listing[]))
      .finally(() => setLoading(false));
  }, [filters, conditionParams]);

  const toggleSelect = (id: string) => {
    setSelectedIds(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  };
  const clearSelection = () => setSelectedIds([]);

  const selectedListings = useMemo(() => listings.filter(l => selectedIds.includes(l.id)), [listings, selectedIds]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold">Bay Area Mercedes SL55 AMG Listings</h1>
        <p className="text-sm text-gray-600 mt-1">New and used SL55 AMG around the Bay Area</p>

        <div className="mt-4">
          <Filters value={filters} onChange={setFilters} />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && <div className="text-gray-600">Loading...</div>}
          {!loading && listings.length === 0 && <div className="text-gray-600">No listings found.</div>}
          {listings.map(l => (
            <ListingCard key={l.id} listing={l} isSelected={selectedIds.includes(l.id)} onToggleSelect={toggleSelect} />
          ))}
        </div>
      </div>

      <CompareBar selectedCount={selectedIds.length} onClear={clearSelection} onCompare={() => setShowCompare(true)} />
      {showCompare && <CompareTable listings={selectedListings} onClose={() => setShowCompare(false)} />}
    </div>
  );
}
