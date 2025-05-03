import { Recipe } from "../types/Recipe";

export const receips: Recipe[] = [
	{
		value: "1",
		label: "vvcafe method",
		grounds: "20",
		waterAmounts: [
			{ id: 1, value: "40" },
			{ id: 2, value: "200" },
			{ id: 3, value: "250" },
			{ id: 4, value: "300" },
		],
	},
	{
		value: "2",
		label: "Chad Wang method",
		grounds: "15",
		waterAmounts: [
			{ id: 1, value: "32" },
			{ id: 2, value: "120" },
			{ id: 3, value: "180" },
			{ id: 4, value: "250" },
		],
	},
	{
		value: "3",
		label: "Rogue Wave method",
		grounds: "15",
		waterAmounts: [
			{ id: 1, value: "40" },
			{ id: 2, value: "100" },
			{ id: 3, value: "200" },
			{ id: 4, value: "250" },
		],
	},
];
