import { ListingsQuery, ListingsResponse, Listing } from "@/types/listing";
import { isInBayArea } from "@/lib/geo";
import Parser from "rss-parser";
// import { ofetch } from "ofetch";

export interface ListingsProvider {
	name: string;
	fetchListings(query: ListingsQuery): Promise<ListingsResponse>;
}

export class MockSL55Provider implements ListingsProvider {
	name = "mock";

	async fetchListings(query: ListingsQuery): Promise<ListingsResponse> {
		const now = new Date().toISOString();
		const base: Listing[] = [
			{
				id: "mock-1",
				title: "2003 Mercedes-Benz SL55 AMG - Supercharged V8",
				condition: "used",
				source: { provider: "mock", listingId: "1", url: "https://example.com/mock/1" },
				specs: {
					year: 2003,
					make: "Mercedes-Benz",
					model: "SL55 AMG",
					trim: "Base",
					mileage: 78000,
					engine: "5.4L Supercharged V8",
					transmission: "Automatic",
					fuelType: "Gasoline",
					exteriorColor: "Silver",
					interiorColor: "Black"
				},
				price: { price: 28995, currency: "USD" },
				location: { latitude: 37.77, longitude: -122.42, city: "San Francisco", state: "CA", postalCode: "94103" },
				images: [{ url: "/sl55-silver.jpg", description: "Front 3/4" }],
				createdAt: now,
				updatedAt: now
			},
			{
				id: "mock-2",
				title: "2005 Mercedes-Benz SL55 AMG - Low Miles",
				condition: "used",
				source: { provider: "mock", listingId: "2", url: "https://example.com/mock/2" },
				specs: {
					year: 2005,
					make: "Mercedes-Benz",
					model: "SL55 AMG",
					mileage: 52000,
					engine: "5.4L Supercharged V8",
					transmission: "Automatic",
					fuelType: "Gasoline",
					exteriorColor: "Black",
					interiorColor: "Red"
				},
				price: { price: 35950, currency: "USD" },
				location: { latitude: 37.3382, longitude: -121.8863, city: "San Jose", state: "CA", postalCode: "95113" },
				images: [{ url: "/sl55-black.jpg", description: "Side" }],
				createdAt: now
			},
			{
				id: "mock-3",
				title: "2024 Mercedes-AMG SL55 - New",
				condition: "new",
				source: { provider: "mock", listingId: "3", url: "https://example.com/mock/3" },
				specs: {
					year: 2024,
					make: "Mercedes-Benz",
					model: "SL55 AMG",
					trim: "AMG SL55 4MATIC+",
					engine: "4.0L Twin-Turbo V8",
					transmission: "Automatic",
					fuelType: "Gasoline",
					exteriorColor: "White",
					interiorColor: "Black"
				},
				price: { price: 148500, msrp: 148500, currency: "USD" },
				location: { latitude: 37.8044, longitude: -122.2711, city: "Oakland", state: "CA", postalCode: "94607" },
				images: [{ url: "/sl55-new.jpg", description: "Dealer stock" }],
				createdAt: now
			}
		];

		let results = base.filter(l => isInBayArea({ latitude: l.location?.latitude ?? 0, longitude: l.location?.longitude ?? 0 }));

		if (query.conditions && query.conditions.length > 0) {
			results = results.filter(l => query.conditions!.includes(l.condition));
		}
		if (query.minYear) results = results.filter(l => l.specs.year >= query.minYear!);
		if (query.maxYear) results = results.filter(l => l.specs.year <= query.maxYear!);
		if (query.minPrice) results = results.filter(l => l.price.price >= query.minPrice!);
		if (query.maxPrice) results = results.filter(l => l.price.price <= query.maxPrice!);
		if (typeof query.maxMileage === "number") results = results.filter(l => (l.specs.mileage ?? Infinity) <= query.maxMileage!);
		if (query.near) {
			results = results.filter(l => {
				if (!l.location) return false;
				const dLat = l.location.latitude;
				const dLon = l.location.longitude;
				const dist = Math.hypot(dLat - query.near!.latitude, dLon - query.near!.longitude);
				return dist < 10; // rough filter as placeholder
			});
		}

		const limited = typeof query.limit === "number" ? results.slice(0, query.limit) : results;
		return { results: limited, count: limited.length };
	}
}

export const defaultProviders: ListingsProvider[] = [new MockSL55Provider()];

// Craigslist RSS provider (no API key):
export class CraigslistProvider implements ListingsProvider {
	name = "craigslist";

	async fetchListings(query: ListingsQuery): Promise<ListingsResponse> {
		// Target SF Bay Area cars+trucks RSS searching for SL55
		const baseUrl = "https://sfbay.craigslist.org/search/cta?format=rss&query=SL55%20AMG";
		const parser: Parser = new Parser();
		const feed = await parser.parseURL(baseUrl);
		const now = new Date().toISOString();
		const results: Listing[] = [];
		for (const item of feed.items ?? []) {
			const title = item.title ?? "";
			const url = item.link ?? "";
			if (!title || !url) continue;
			// Craigslist titles often contain price like "$28,900 - 2003 Mercedes ..."
			const priceMatch = title.match(/\$(\d[\d,]*)/);
			const price = priceMatch ? Number(priceMatch[1].replace(/,/g, "")) : undefined;
			const yearMatch = title.match(/\b(20\d{2}|19\d{2})\b/);
			const year = yearMatch ? Number(yearMatch[1]) : undefined;
			if (query.minYear && year && year < query.minYear) continue;
			if (query.maxYear && year && year > query.maxYear) continue;
			if (query.minPrice && price && price < query.minPrice) continue;
			if (query.maxPrice && price && price > query.maxPrice) continue;
			const listing: Listing = {
				id: `craigslist-${item.guid ?? url}`,
				title,
				condition: "used",
				source: { provider: "craigslist", listingId: String(item.guid ?? url), url },
				specs: { year: year ?? 0, make: "Mercedes-Benz", model: "SL55 AMG" },
				price: { price: price ?? 0, currency: "USD" },
				location: { latitude: 37.7749, longitude: -122.4194, city: "SF Bay Area", state: "CA" },
				images: [],
				createdAt: now
			};
			results.push(listing);
		}
		const filtered = results.filter(l => (!query.minYear || l.specs.year >= query.minYear) && (!query.maxYear || l.specs.year <= query.maxYear));
		const limited = typeof query.limit === "number" ? filtered.slice(0, query.limit) : filtered;
		return { results: limited, count: limited.length };
	}
}

export function getProvidersFromEnv(): ListingsProvider[] {
	const enabled = (process.env.NEXT_PUBLIC_ENABLED_PROVIDERS ?? "mock,craigslist").split(",").map(s => s.trim());
	const providers: ListingsProvider[] = [];
	if (enabled.includes("mock")) providers.push(new MockSL55Provider());
	if (enabled.includes("craigslist")) providers.push(new CraigslistProvider());
	return providers;
}


