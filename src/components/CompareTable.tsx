"use client";
import { Listing } from "@/types/listing";

interface CompareTableProps {
	listings: Listing[];
	onClose: () => void;
}

export function CompareTable({ listings, onClose }: CompareTableProps) {
	if (listings.length === 0) return null;
	return (
		<div className="fixed inset-0 z-50 bg-black/50 p-6 overflow-auto">
			<div className="mx-auto max-w-6xl bg-white rounded-xl shadow-xl p-6">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Compare Listings</h2>
					<button onClick={onClose} className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Close</button>
				</div>
				<div className="mt-4 overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left text-gray-500">
								<th className="p-2">Field</th>
								{listings.map(l => (
									<th key={l.id} className="p-2 font-semibold text-gray-900">{l.title}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{[
								{ key: "price", label: "Price", format: (l: Listing) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(l.price.price) },
								{ key: "year", label: "Year", format: (l: Listing) => String(l.specs.year) },
								{ key: "mileage", label: "Mileage", format: (l: Listing) => (l.specs.mileage ?? "—").toString() },
								{ key: "engine", label: "Engine", format: (l: Listing) => l.specs.engine ?? "—" },
								{ key: "location", label: "Location", format: (l: Listing) => l.location?.city ? `${l.location.city}, ${l.location.state}` : "—" }
							].map(row => (
								<tr key={row.key} className="border-t">
									<td className="p-2 font-medium text-gray-700">{row.label}</td>
									{listings.map(l => (
										<td key={l.id + row.key} className="p-2">{row.format(l)}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}


