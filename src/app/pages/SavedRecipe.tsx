import { Coffee, X } from "lucide-react";
import { useState } from "react";

interface Pour {
	id: string;
	amount: number;
	timeMarkSeconds: number;
}

interface Recipe {
	id: string;
	name: string;
	coffeeGrounds: number;
	pours: Pour[];
	createdAt: number;
}

interface SavedRecipeProps {
	recipes: Recipe[];
	selectedRecipeId: string | null;
	selectRecipe: (recipe: Recipe) => void;
	deleteRecipe: (id: string) => void;
	selectedRecipe: Recipe | undefined;
	adjustedCoffee: number | null;
	setAdjustedCoffee: (coffee: number | null) => void;
	adjustedPours: Pour[] | null;
	startBrewing: () => void;
	isDarkTheme: boolean;
	setView: (view: "create" | "saved" | "timer") => void;
	formatTimeInput: (seconds: number) => string;
	getTotalWater: (poursList: Pour[]) => number;
	calculateRatio: (coffee: number, totalWater: number) => string;
	setCoffeeGrounds: (amount: number) => void;
	setPours: (pours: Pour[]) => void;
}

export function SavedRecipe({
	recipes,
	selectedRecipeId,
	selectRecipe,
	deleteRecipe,
	selectedRecipe,
	adjustedCoffee,
	setAdjustedCoffee,
	adjustedPours,
	startBrewing,
	isDarkTheme,
	setView,
	formatTimeInput,
	getTotalWater,
	calculateRatio,
	setCoffeeGrounds,
	setPours,
}: SavedRecipeProps) {
	const [showOriginalRecipe, setShowOriginalRecipe] = useState(false);

	const themes = {
		card: isDarkTheme
			? "bg-slate-800 border-slate-700"
			: "bg-white border-amber-100",
		input: isDarkTheme
			? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500"
			: "bg-white border-amber-100 text-amber-900 placeholder-white-300",
		heading: isDarkTheme ? "text-white" : "text-amber-900",
		text: isDarkTheme ? "text-slate-400" : "text-amber-700",
		primaryBtn: isDarkTheme
			? "bg-amber-700 hover:bg-amber-600 text-white"
			: "bg-amber-600 hover:bg-amber-700 text-white",
	};

	return (
		<div className="space-y-6">
			{/* Recipe Selector */}
			{recipes.length > 0 ? (
				<div className={`rounded-xl p-4 shadow-sm border ${themes.card}`}>
					<label className={`block mb-3 ${themes.heading}`}>
						Select a Recipe
					</label>
					<div className="space-y-2">
						{recipes.map((recipe) => (
							<div
								key={recipe.id}
								className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
									selectedRecipeId === recipe.id
										? isDarkTheme
											? "border-amber-500 bg-slate-700"
											: "border-amber-500 bg-amber-50"
										: isDarkTheme
											? "border-slate-700 hover:border-amber-600"
											: "border-amber-100 hover:border-amber-500"
								}`}
								onClick={() => selectRecipe(recipe)}
							>
								<div>
									<div className={themes.heading}>{recipe.name}</div>
									<div className={`${themes.text} text-sm`}>
										{recipe.coffeeGrounds}g • {getTotalWater(recipe.pours)}ml •{" "}
										{recipe.pours.length} pours
									</div>
									<div className={`${themes.text} text-sm`}>
										{formatTimeInput(recipe.pours[0]?.timeMarkSeconds || 0)} -{" "}
										{formatTimeInput(
											recipe.pours[recipe.pours.length - 1]?.timeMarkSeconds ||
												0,
										)}
									</div>
								</div>
								<button
									onClick={(e) => {
										e.stopPropagation();
										deleteRecipe(recipe.id);
									}}
									className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>
				</div>
			) : (
				<div
					className={`rounded-xl p-8 shadow-sm text-center border ${themes.card}`}
				>
					<Coffee
						className={`w-12 h-12 ${isDarkTheme ? "text-amber-600" : "text-amber-500"} mx-auto mb-3`}
					/>
					<p className={`${themes.text} mb-4`}>No saved recipes yet</p>
					<button
						onClick={() => setView("create")}
						className={`px-6 py-2 rounded-lg transition-colors ${themes.primaryBtn}`}
					>
						Create Your First Recipe
					</button>
				</div>
			)}

			{/* Selected Recipe Details */}
			{selectedRecipe && (
				<>
					{/* Original Recipe */}
					<div className={`rounded-xl p-4 shadow-sm border ${themes.card}`}>
						<button
							onClick={() => setShowOriginalRecipe(!showOriginalRecipe)}
							className={`w-full flex items-center justify-between ${themes.heading}`}
						>
							<span>Original Recipe</span>
							<span className={themes.text}>
								{showOriginalRecipe ? "−" : "+"}
							</span>
						</button>
						{showOriginalRecipe && (
							<div className="mt-4">
								<div
									className={`space-y-2 mb-3 ${isDarkTheme ? "border-slate-700" : "border-amber-100"}`}
								>
									<div
										className={`flex justify-between py-2 border-b ${isDarkTheme ? "border-slate-700" : "border-amber-100"}`}
									>
										<span className={themes.text}>Coffee</span>
										<span className={themes.heading}>
											{selectedRecipe.coffeeGrounds}g
										</span>
									</div>
									{selectedRecipe.pours.map((pour, index) => (
										<div
											key={pour.id}
											className={`flex justify-between py-2 border-b ${isDarkTheme ? "border-slate-700" : "border-amber-100"}`}
										>
											<span className={themes.text}>Pour {index + 1}</span>
											<div className="text-right">
												<div className={themes.heading}>{pour.amount}ml</div>
												<div className={`${themes.text} text-sm`}>
													@ {formatTimeInput(pour.timeMarkSeconds)}
												</div>
											</div>
										</div>
									))}
									<div
										className={`flex justify-between py-2 border-b ${isDarkTheme ? "border-slate-700" : "border-amber-100"}`}
									>
										<span className={themes.text}>Total Water</span>
										<span className={themes.heading}>
											{getTotalWater(selectedRecipe.pours)}ml
										</span>
									</div>
								</div>
								<div
									className={`p-3 rounded-lg ${isDarkTheme ? "bg-slate-700" : "bg-amber-50"}`}
								>
									<div className={themes.text}>Ratio</div>
									<div className={themes.heading}>
										1:
										{calculateRatio(
											selectedRecipe.coffeeGrounds,
											getTotalWater(selectedRecipe.pours),
										)}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Adjust Coffee */}
					<div className={`rounded-xl p-4 shadow-sm border ${themes.card}`}>
						<label className={`block mb-2 ${themes.heading}`}>
							Adjust Coffee Amount
						</label>
						<input
							type="tel"
							inputMode="numeric"
							value={adjustedCoffee ?? selectedRecipe.coffeeGrounds}
							onChange={(e) => setAdjustedCoffee(Number(e.target.value))}
							className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border ${themes.input}`}
						/>
						{adjustedCoffee !== null &&
							adjustedCoffee !== selectedRecipe.coffeeGrounds && (
								<button
									onClick={() => setAdjustedCoffee(null)}
									className="mt-2 text-amber-400 hover:text-amber-300"
								>
									Reset to original
								</button>
							)}
					</div>

					{/* Adjusted Recipe */}
					{adjustedCoffee !== null &&
						adjustedCoffee !== selectedRecipe.coffeeGrounds &&
						adjustedPours && (
							<div
								className={`rounded-xl p-4 shadow-md border ${
									isDarkTheme
										? "bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-white"
										: "bg-gradient-to-br from-white to-amber-50 border-amber-200 text-amber-900"
								}`}
							>
								<h3 className={`mb-3 ${themes.heading}`}>Adjusted Recipe</h3>
								<div
									className={`space-y-2 mb-3 ${isDarkTheme ? "border-slate-600" : "border-amber-100"}`}
								>
									<div
										className={`flex justify-between py-2 border-b ${isDarkTheme ? "border-slate-600" : "border-amber-100"}`}
									>
										<span className={isDarkTheme ? "opacity-90" : "opacity-75"}>
											Coffee
										</span>
										<span>{adjustedCoffee}g</span>
									</div>
									{adjustedPours.map((pour, index) => (
										<div
											key={pour.id}
											className={`flex justify-between py-2 border-b ${isDarkTheme ? "border-slate-600" : "border-amber-100"}`}
										>
											<span
												className={isDarkTheme ? "opacity-90" : "opacity-75"}
											>
												Pour {index + 1}
											</span>
											<div className="text-right">
												<div>{pour.amount}ml</div>
												<div
													className={`text-sm ${isDarkTheme ? "opacity-75" : "opacity-60"}`}
												>
													@ {formatTimeInput(pour.timeMarkSeconds)}
												</div>
											</div>
										</div>
									))}
									<div
										className={`flex justify-between py-2 border-b ${isDarkTheme ? "border-slate-600" : "border-amber-100"}`}
									>
										<span className={isDarkTheme ? "opacity-90" : "opacity-75"}>
											Total Water
										</span>
										<span>{getTotalWater(adjustedPours)}ml</span>
									</div>
								</div>
								<div
									className={`p-3 rounded-lg ${isDarkTheme ? "bg-slate-600/50" : "bg-amber-100/50"}`}
								>
									<div className={isDarkTheme ? "opacity-90" : "opacity-75"}>
										Ratio
									</div>
									<div>
										1:
										{calculateRatio(
											adjustedCoffee,
											getTotalWater(adjustedPours),
										)}
									</div>
								</div>
							</div>
						)}

					{/* Start Brewing Button */}
					<button
						onClick={() => {
							if (
								adjustedCoffee !== null &&
								adjustedCoffee !== selectedRecipe.coffeeGrounds &&
								adjustedPours
							) {
								setCoffeeGrounds(adjustedCoffee);
								setPours(adjustedPours.map((p) => ({ ...p })));
							}
							startBrewing();
						}}
						className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Start Brewing
					</button>
				</>
			)}
		</div>
	);
}
