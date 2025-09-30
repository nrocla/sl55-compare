export type Condition = "new" | "used" | "certified";

export interface DealerInfo {
	name: string;
	locationCity: string;
	locationState: string;
	phone?: string;
	website?: string;
}

export interface ListingSourceMeta {
	provider: "mock" | "cars" | "autotrader" | "craigslist" | "facebook" | "edmunds" | "dealer";
	listingId: string;
	url: string;
}

export interface VehicleSpecs {
	year: number;
	make: string; // Expected "Mercedes-Benz"
	model: string; // Expected "SL55 AMG"
	trim?: string;
	mileage?: number; // miles
	vin?: string;
	transmission?: string;
	drivetrain?: string;
	engine?: string; // e.g. 5.4L Supercharged V8
	fuelType?: string;
	exteriorColor?: string;
	interiorColor?: string;
}

export interface PriceInfo {
	price: number; // USD
	msrp?: number;
	monthlyEstimate?: number;
	currency?: "USD";
}

export interface GeoLocation {
	latitude: number;
	longitude: number;
	city?: string;
	state?: string;
	postalCode?: string;
}

export interface ListingImage {
	url: string;
	description?: string;
}

export interface Listing {
	id: string; // stable id within our system
	title: string;
	condition: Condition;
	source: ListingSourceMeta;
	dealer?: DealerInfo;
	specs: VehicleSpecs;
	price: PriceInfo;
	location?: GeoLocation;
	images?: ListingImage[];
	createdAt: string; // ISO date
	updatedAt?: string; // ISO date
}

export interface ListingsQuery {
	query: string; // free text, e.g. "SL55 AMG"
	conditions?: Condition[];
	minYear?: number;
	maxYear?: number;
	minPrice?: number;
	maxPrice?: number;
	maxMileage?: number;
	near?: { latitude: number; longitude: number; radiusMiles: number };
	limit?: number;
}

export interface ListingsResponse {
	results: Listing[];
	count: number;
}


