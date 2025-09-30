"use client";
import { useState, useEffect } from "react";

export interface FiltersState {
	minYear?: number;
	maxYear?: number;
	minPrice?: number;
	maxPrice?: number;
	maxMileage?: number;
	conditions: { new: boolean; used: boolean; certified: boolean };
}

interface FiltersProps {
	value: FiltersState;
	onChange: (value: FiltersState) => void;
}

export function Filters({ value, onChange }: FiltersProps) {
	const [local, setLocal] = useState<FiltersState>(value);

	useEffect(() => setLocal(value), [value]);
	useEffect(() => onChange(local), [local, onChange]);

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
			<div>
				<label className="block text-xs text-gray-600">Min Year</label>
				<input type="number" value={local.minYear ?? ""} onChange={e => setLocal(s => ({ ...s, minYear: e.target.value ? Number(e.target.value) : undefined }))} className="mt-1 w-full rounded-md border-gray-300 text-sm" placeholder="2002" />
			</div>
			<div>
				<label className="block text-xs text-gray-600">Max Year</label>
				<input type="number" value={local.maxYear ?? ""} onChange={e => setLocal(s => ({ ...s, maxYear: e.target.value ? Number(e.target.value) : undefined }))} className="mt-1 w-full rounded-md border-gray-300 text-sm" placeholder="2025" />
			</div>
			<div>
				<label className="block text-xs text-gray-600">Min Price</label>
				<input type="number" value={local.minPrice ?? ""} onChange={e => setLocal(s => ({ ...s, minPrice: e.target.value ? Number(e.target.value) : undefined }))} className="mt-1 w-full rounded-md border-gray-300 text-sm" placeholder="20000" />
			</div>
			<div>
				<label className="block text-xs text-gray-600">Max Price</label>
				<input type="number" value={local.maxPrice ?? ""} onChange={e => setLocal(s => ({ ...s, maxPrice: e.target.value ? Number(e.target.value) : undefined }))} className="mt-1 w-full rounded-md border-gray-300 text-sm" placeholder="200000" />
			</div>
			<div>
				<label className="block text-xs text-gray-600">Max Mileage</label>
				<input type="number" value={local.maxMileage ?? ""} onChange={e => setLocal(s => ({ ...s, maxMileage: e.target.value ? Number(e.target.value) : undefined }))} className="mt-1 w-full rounded-md border-gray-300 text-sm" placeholder="90000" />
			</div>
			<div className="flex items-center gap-3">
				<label className="text-xs text-gray-600">Condition</label>
				<label className="inline-flex items-center gap-1 text-sm"><input type="checkbox" checked={local.conditions.new} onChange={e => setLocal(s => ({ ...s, conditions: { ...s.conditions, new: e.target.checked } }))} /> New</label>
				<label className="inline-flex items-center gap-1 text-sm"><input type="checkbox" checked={local.conditions.used} onChange={e => setLocal(s => ({ ...s, conditions: { ...s.conditions, used: e.target.checked } }))} /> Used</label>
				<label className="inline-flex items-center gap-1 text-sm"><input type="checkbox" checked={local.conditions.certified} onChange={e => setLocal(s => ({ ...s, conditions: { ...s.conditions, certified: e.target.checked } }))} /> CPO</label>
			</div>
		</div>
	);
}


