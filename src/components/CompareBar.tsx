"use client";
interface CompareBarProps {
	selectedCount: number;
	onCompare: () => void;
	onClear: () => void;
}

export function CompareBar({ selectedCount, onCompare, onClear }: CompareBarProps) {
	if (selectedCount === 0) return null;
	return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
			<div className="flex items-center gap-3 rounded-full bg-white shadow-lg border px-4 py-2">
				<div className="text-sm text-gray-700">{selectedCount} selected</div>
				<button onClick={onClear} className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Clear</button>
				<button onClick={onCompare} className="text-sm px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700">Compare</button>
			</div>
		</div>
	);
}


