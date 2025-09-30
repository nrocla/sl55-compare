export interface LatLng {
	latitude: number;
	longitude: number;
}

export function haversineMiles(a: LatLng, b: LatLng): number {
	const R = 3958.7613; // miles
	const toRad = (v: number) => (v * Math.PI) / 180;
	const dLat = toRad(b.latitude - a.latitude);
	const dLon = toRad(b.longitude - a.longitude);
	const lat1 = toRad(a.latitude);
	const lat2 = toRad(b.latitude);
	const sinDLat = Math.sin(dLat / 2);
	const sinDLon = Math.sin(dLon / 2);
	const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Approximate Bay Area center and radius to include major cities
export const BAY_AREA_CENTER: LatLng = { latitude: 37.7749, longitude: -122.4194 }; // SF
export const BAY_AREA_RADIUS_MILES = 60; // covers SF, East Bay, South Bay, North Bay

export function isInBayArea(point?: LatLng, radiusMiles: number = BAY_AREA_RADIUS_MILES): boolean {
	if (!point) return false;
	return haversineMiles(point, BAY_AREA_CENTER) <= radiusMiles;
}


