export interface Recipe {
	value: string;
	label: string;
	grounds: string;
	waterAmounts: Array<{ id: number; value: string }>;
}
