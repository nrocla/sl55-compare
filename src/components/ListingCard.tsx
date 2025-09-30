"use client";
import Image from "next/image";
import { Listing } from "@/types/listing";
import { useMemo } from "react";

interface ListingCardProps {
	listing: Listing;
	isSelected?: boolean;
	onToggleSelect?: (id: string) => void;
}

export function ListingCard({ listing, isSelected, onToggleSelect }: ListingCardProps) {
	const priceLabel = useMemo(() => {
		return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(listing.price.price);
	}, [listing.price.price]);

	return (
		<div className={`rounded-lg border ${isSelected ? "border-blue-600" : "border-gray-200"} bg-white shadow-sm hover:shadow-md transition`}> 
			<div className="flex gap-4 p-4">
				<div className="w-40 h-28 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
					{listing.images?.[0]?.url ? (
						<Image src={listing.images[0].url} alt={listing.title} fill className="object-cover" />
					) : (
						<div className="w-full h-full grid place-items-center text-gray-400 text-sm">No image</div>
					)}
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-3">
						<h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
						<div className="text-right">
							<div className="text-lg font-bold text-gray-900">{priceLabel}</div>
							<div className="text-xs text-gray-500 uppercase tracking-wide">{listing.condition}</div>
						</div>
					</div>
					<div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
						<span>{listing.specs.year}</span>
						<span>{listing.specs.engine}</span>
						{typeof listing.specs.mileage === "number" && <span>{listing.specs.mileage.toLocaleString()} mi</span>}
						{listing.location?.city && <span>{listing.location.city}, {listing.location.state}</span>}
					</div>
					<div className="mt-2 flex items-center justify-between">
						<a href={listing.source.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">View source</a>
						<button onClick={() => onToggleSelect?.(listing.id)} className={`px-3 py-1.5 rounded-md text-sm font-medium ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}>
							{isSelected ? "Selected" : "Compare"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}


