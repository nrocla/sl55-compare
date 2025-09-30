import { NextRequest } from "next/server";
import { ListingsResponse, ListingsQuery } from "@/types/listing";
import { getProvidersFromEnv } from "@/lib/providers";
import { BAY_AREA_CENTER, BAY_AREA_RADIUS_MILES } from "@/lib/geo";

export async function GET(req: NextRequest): Promise<Response> {
	const { searchParams } = new URL(req.url);
	const q: ListingsQuery = {
		query: searchParams.get("q") ?? "SL55 AMG",
		conditions: searchParams.getAll("condition").filter((v): v is "new" | "used" | "certified" => ["new","used","certified"].includes(v)),
		minYear: searchParams.get("minYear") ? Number(searchParams.get("minYear")) : undefined,
		maxYear: searchParams.get("maxYear") ? Number(searchParams.get("maxYear")) : undefined,
		minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
		maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
		maxMileage: searchParams.get("maxMileage") ? Number(searchParams.get("maxMileage")) : undefined,
		near: {
			latitude: Number(searchParams.get("lat") ?? BAY_AREA_CENTER.latitude),
			longitude: Number(searchParams.get("lng") ?? BAY_AREA_CENTER.longitude),
			radiusMiles: Number(searchParams.get("radius") ?? BAY_AREA_RADIUS_MILES)
		},
		limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 50
	};

	const providers = getProvidersFromEnv();
	const results = await Promise.all(
		providers.map(p => p.fetchListings(q).catch(() => ({ results: [], count: 0 } as ListingsResponse)))
	);
	const merged = results.flatMap(r => r.results);
	return Response.json({ results: merged, count: merged.length } satisfies ListingsResponse, { status: 200 });
}


