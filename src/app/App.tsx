import {
	Beaker,
	Coffee,
	Plus,
	Save,
	Sparkles,
	Timer as TimerIcon,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Timer } from "./components/Timer";

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

interface BrewPreset {
	name: string;
	coffeeGrounds: number;
	pours: Pour[];
	description: string;
}

const BREW_PRESETS: BrewPreset[] = [
	{
		name: "V60 vvcafe method",
		coffeeGrounds: 20,
		pours: [
			{ id: "1", amount: 40, timeMarkSeconds: 30 },
			{ id: "2", amount: 200, timeMarkSeconds: 90 },
			{ id: "3", amount: 250, timeMarkSeconds: 120 },
			{ id: "4", amount: 300, timeMarkSeconds: 150 },
		],
		description: "slightly heavier body, more pronounced sweetness",
	},
	{
		name: "V60 Chad Wang method",
		coffeeGrounds: 15,
		pours: [
			{ id: "1", amount: 32, timeMarkSeconds: 30 },
			{ id: "2", amount: 120, timeMarkSeconds: 60 },
			{ id: "3", amount: 180, timeMarkSeconds: 90 },
			{ id: "4", amount: 250, timeMarkSeconds: 120 },
		],
		description: "last two pours, center pour, light body",
	},
	{
		name: "V60 Rogue Wave method",
		coffeeGrounds: 15,
		pours: [
			{ id: "1", amount: 45, timeMarkSeconds: 45 },
			{ id: "2", amount: 100, timeMarkSeconds: 60 },
			{ id: "3", amount: 200, timeMarkSeconds: 90 },
			{ id: "4", amount: 250, timeMarkSeconds: 120 },
		],
		description:
			"pour 2 and 3 continue pouring, pour 1 and 4 center pour, pour 2 circular, light body",
	},
];

export default function App() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
	const [recipeName, setRecipeName] = useState("");
	const [coffeeGrounds, setCoffeeGrounds] = useState(20);
	const [pours, setPours] = useState<Pour[]>([
		{ id: "1", amount: 50, timeMarkSeconds: 0 },
		{ id: "2", amount: 50, timeMarkSeconds: 45 },
	]);
	const [adjustedCoffee, setAdjustedCoffee] = useState<number | null>(null);
	const [view, setView] = useState<"create" | "saved" | "timer">("create");
	const [currentPourIndex, setCurrentPourIndex] = useState(0);
	const [showPresets, setShowPresets] = useState(false);
	const [showOriginalRecipe, setShowOriginalRecipe] = useState(false);

	// Load recipes from localStorage
	useEffect(() => {
		const savedRecipes = localStorage.getItem("coffeeRecipes");
		if (savedRecipes) {
			setRecipes(JSON.parse(savedRecipes));
		}
	}, []);

	// Save recipes to localStorage
	const saveRecipesToStorage = (updatedRecipes: Recipe[]) => {
		localStorage.setItem("coffeeRecipes", JSON.stringify(updatedRecipes));
		setRecipes(updatedRecipes);
	};

	const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);

	const addPour = () => {
		const lastPour = pours[pours.length - 1];
		const newTimeMark = lastPour ? lastPour.timeMarkSeconds + 30 : 0;
		setPours([
			...pours,
			{ id: Date.now().toString(), amount: 50, timeMarkSeconds: newTimeMark },
		]);
	};

	const removePour = (id: string) => {
		if (pours.length > 1) {
			setPours(pours.filter((p) => p.id !== id));
		}
	};

	const updatePourAmount = (id: string, amount: number) => {
		setPours(pours.map((p) => (p.id === id ? { ...p, amount } : p)));
	};

	const updatePourTimeMark = (id: string, timeMarkSeconds: number) => {
		setPours(pours.map((p) => (p.id === id ? { ...p, timeMarkSeconds } : p)));
	};

	const formatTimeInput = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const parseTimeInput = (timeString: string): number => {
		const parts = timeString.split(":");
		if (parts.length === 2) {
			const mins = parseInt(parts[0]) || 0;
			const secs = parseInt(parts[1]) || 0;
			return mins * 60 + secs;
		}
		return parseInt(timeString) || 0;
	};

	const saveRecipe = () => {
		if (!recipeName.trim()) {
			alert("Please enter a recipe name");
			return;
		}

		const newRecipe: Recipe = {
			id: Date.now().toString(),
			name: recipeName,
			coffeeGrounds,
			pours: [...pours],
			createdAt: Date.now(),
		};

		saveRecipesToStorage([...recipes, newRecipe]);
		setRecipeName("");
		alert("Recipe saved!");
	};

	const selectRecipe = (recipe: Recipe) => {
		setSelectedRecipeId(recipe.id);
		setCoffeeGrounds(recipe.coffeeGrounds);
		setPours(recipe.pours.map((p) => ({ ...p })));
		setAdjustedCoffee(null);
		setView("saved");
	};

	const deleteRecipe = (id: string) => {
		if (confirm("Delete this recipe?")) {
			const updatedRecipes = recipes.filter((r) => r.id !== id);
			saveRecipesToStorage(updatedRecipes);
			if (selectedRecipeId === id) {
				setSelectedRecipeId(null);
				setAdjustedCoffee(null);
			}
		}
	};

	const calculateRatio = (coffee: number, totalWater: number) => {
		const ratio = totalWater / coffee;
		return ratio.toFixed(1);
	};

	const getTotalWater = (poursList: Pour[]) => {
		return poursList[poursList.length - 1].amount;
	};

	const getAdjustedPours = () => {
		if (!selectedRecipe || adjustedCoffee === null) return null;
		const originalTotal = getTotalWater(selectedRecipe.pours);
		const ratio = adjustedCoffee / selectedRecipe.coffeeGrounds;
		return selectedRecipe.pours.map((p) => ({
			...p,
			amount: Math.round(p.amount * ratio),
			timeMarkSeconds: p.timeMarkSeconds,
		}));
	};

	const applyPreset = (preset: BrewPreset) => {
		setRecipeName(preset.name);
		setCoffeeGrounds(preset.coffeeGrounds);
		setPours(
			preset.pours.map((p, i) => ({
				...p,
				id: Date.now().toString() + Math.random() + i,
			})),
		);
		setShowPresets(false);
	};

	const startBrewing = () => {
		setCurrentPourIndex(0);
		setView("timer");
		if (selectedRecipe && !recipeName) {
			setRecipeName(selectedRecipe.name);
		}
	};

	const handlePourComplete = () => {
		if (currentPourIndex < pours.length) {
			setCurrentPourIndex(currentPourIndex + 1);
		}
	};

	const handleResetPour = () => {
		setCurrentPourIndex(0);
	};

	const adjustedPours = getAdjustedPours();
	const currentTotalWater = getTotalWater(pours);
	const currentRatio = calculateRatio(coffeeGrounds, currentTotalWater);

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 pb-8">
			<div className="max-w-md mx-auto">
				{/* Header */}
				<div className="text-center mb-6 pt-4">
					<div className="flex items-center justify-center gap-2 mb-2">
						<Coffee className="w-8 h-8 text-amber-400" />
						<h1 className="text-amber-100">Coffee Brew Guide</h1>
					</div>
					<p className="text-slate-400">
						Create and manage your pour-over recipes
					</p>
				</div>

				{/* View Toggle */}
				<div className="flex gap-2 mb-6">
					<button
						onClick={() => setView("create")}
						className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
							view === "create"
								? "bg-amber-600 text-white"
								: "bg-slate-800 text-amber-400 border  border-amber-100"
						}`}
					>
						New Recipe
					</button>
					<button
						onClick={() => setView("saved")}
						className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
							view === "saved"
								? "bg-amber-600 text-white"
								: "bg-slate-800 text-amber-400 border  border-amber-100"
						}`}
					>
						Saved ({recipes.length})
					</button>
					<button
						onClick={() => setView("timer")}
						className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
							view === "timer"
								? "bg-amber-600 text-white"
								: "bg-slate-800 text-amber-400 border  border-amber-100"
						}`}
					>
						<TimerIcon className="w-4 h-4 mx-auto" />
					</button>
				</div>

				{/* Create Recipe View */}
				{view === "create" && (
					<div className="space-y-6">
						{/* Brewing Method Presets */}
						<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
							<button
								onClick={() => setShowPresets(!showPresets)}
								className="w-full flex items-center justify-between text-amber-100"
							>
								<span className="flex items-center gap-2">
									<Sparkles className="w-5 h-5" />
									Brewing Method Presets
								</span>
								<span className="text-slate-400">
									{showPresets ? "−" : "+"}
								</span>
							</button>

							{showPresets && (
								<div className="mt-4 space-y-2">
									{BREW_PRESETS.map((preset) => (
										<button
											key={preset.name}
											onClick={() => applyPreset(preset)}
											className="w-full text-left p-3 rounded-lg border border-amber-700 hover:bg-slate-700 transition-colors"
										>
											<div className="text-amber-100">{preset.name}</div>
											<div className="text-slate-400">{preset.description}</div>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Recipe Name */}
						<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
							<label className="block mb-2 text-amber-100">Recipe Name</label>
							<input
								type="text"
								value={recipeName}
								onChange={(e) => setRecipeName(e.target.value)}
								placeholder="e.g., Morning V60"
								className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
							/>
						</div>

						{/* Coffee Grounds */}
						<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
							<label className="block mb-2 text-amber-100">
								Coffee Grounds (g)
							</label>
							<input
								type="tel"
								inputMode="numeric"
								value={coffeeGrounds}
								onChange={(e) => setCoffeeGrounds(Number(e.target.value))}
								className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
							/>
						</div>

						{/* Pours */}
						<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
							<div className="flex items-center justify-between mb-2">
								<label className="text-amber-100">Pours</label>
								<button
									onClick={addPour}
									className="flex items-center gap-1 px-3 py-1.5 bg-amber-700 text-amber-100 rounded-lg hover:bg-amber-600 transition-colors"
								>
									<Plus className="w-4 h-4" />
									Add Pour
								</button>
							</div>
							<p className="text-slate-400 text-sm mb-3">
								Enter water amount and time mark (mm:ss) for each pour
							</p>

							<div className="space-y-3">
								{pours.map((pour, index) => (
									<div
										key={pour.id}
										className="space-y-2 rounded-lg border border-slate-700 py-2 px-2 bg-slate-700"
									>
										<div className="flex items-center justify-between">
											<span className="text-amber-100 text-sm sm:text-base">
												Pour {index + 1}
											</span>
											{pours.length > 1 && (
												<button
													onClick={() => removePour(pour.id)}
													className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
												>
													<X className="w-4 h-4" />
												</button>
											)}
										</div>
										<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center mr-2">
											<div className="flex items-center flex-1">
												<input
													type="tel"
													inputMode="numeric"
													value={pour.amount}
													onChange={(e) =>
														updatePourAmount(pour.id, Number(e.target.value))
													}
													placeholder="Amount"
													className="flex-1 px-1 sm:px-2 py-1.5 text-sm bg-slate-600 border border-slate-500 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-0"
												/>
												<span className="ml-1 text-slate-400 text-xs sm:text-sm whitespace-nowrap">
													ml
												</span>
											</div>
											<div className="flex items-center flex-1">
												<input
													type="text"
													value={formatTimeInput(pour.timeMarkSeconds)}
													onChange={(e) =>
														updatePourTimeMark(
															pour.id,
															parseTimeInput(e.target.value),
														)
													}
													placeholder="0:00"
													className="flex-1 px-1 sm:px-2 py-1.5 text-sm bg-slate-600 border border-slate-500 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-0"
												/>
												<TimerIcon className="ml-1 w-4 h-4 text-slate-400 flex-shrink-0" />
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Current Ratio Display */}
						<div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white rounded-xl p-4 shadow-sm">
							<div className="flex items-center justify-between mb-2">
								<span className="flex items-center gap-2">
									<Beaker className="w-5 h-5" />
									Water to Coffee Ratio
								</span>
							</div>
							<div className="flex items-baseline gap-2">
								<span className="opacity-90">{currentTotalWater}ml water</span>
								<span className="opacity-75">/</span>
								<span className="opacity-90">{coffeeGrounds}g coffee</span>
								<span className="opacity-75">=</span>
								<span>1:{currentRatio}</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<button
								onClick={startBrewing}
								className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md"
							>
								<TimerIcon className="w-5 h-5" />
								Start Brewing
							</button>
							<button
								onClick={saveRecipe}
								className="flex-1 py-4 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 shadow-md"
							>
								<Save className="w-5 h-5" />
								Save Recipe
							</button>
						</div>
					</div>
				)}

				{/* Saved Recipes View */}
				{view === "saved" && (
					<div className="space-y-6">
						{/* Recipe Selector */}
						{recipes.length > 0 ? (
							<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
								<label className="block mb-3 text-amber-100">
									Select a Recipe
								</label>
								<div className="space-y-2">
									{recipes.map((recipe) => (
										<div
											key={recipe.id}
											className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
												selectedRecipeId === recipe.id
													? "border-amber-500 bg-slate-700"
													: "border-slate-700 hover:border-amber-600"
											}`}
											onClick={() => selectRecipe(recipe)}
										>
											<div>
												<div className="text-amber-100">{recipe.name}</div>
												<div className="text-slate-400 text-sm">
													{recipe.coffeeGrounds}g •{" "}
													{getTotalWater(recipe.pours)}ml •{" "}
													{recipe.pours.length} pours
												</div>
												<div className="text-slate-400 text-sm">
													{formatTimeInput(
														recipe.pours[0]?.timeMarkSeconds || 0,
													)}{" "}
													-{" "}
													{formatTimeInput(
														recipe.pours[recipe.pours.length - 1]
															?.timeMarkSeconds || 0,
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
							<div className="bg-slate-800 rounded-xl p-8 shadow-sm text-center border border-slate-700">
								<Coffee className="w-12 h-12 text-amber-600 mx-auto mb-3" />
								<p className="text-slate-400 mb-4">No saved recipes yet</p>
								<button
									onClick={() => setView("create")}
									className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
								>
									Create Your First Recipe
								</button>
							</div>
						)}

						{/* Selected Recipe Details */}
						{selectedRecipe && (
							<>
								{/* Original Recipe */}
								<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
									<button
										onClick={() => setShowOriginalRecipe(!showOriginalRecipe)}
										className="w-full flex items-center justify-between text-amber-100"
									>
										<span>Original Recipe</span>
										<span className="text-slate-400">
											{showOriginalRecipe ? "−" : "+"}
										</span>
									</button>
									{showOriginalRecipe && (
										<div className="mt-4">
											<div className="space-y-2 mb-3">
												<div className="flex justify-between py-2 border-b border-slate-700">
													<span className="text-slate-400">Coffee</span>
													<span className="text-amber-100">
														{selectedRecipe.coffeeGrounds}g
													</span>
												</div>
												{selectedRecipe.pours.map((pour, index) => (
													<div
														key={pour.id}
														className="flex justify-between py-2 border-b border-slate-700"
													>
														<span className="text-slate-400">
															Pour {index + 1}
														</span>
														<div className="text-right">
															<div className="text-amber-100">
																{pour.amount}ml
															</div>
															<div className="text-slate-400 text-sm">
																@ {formatTimeInput(pour.timeMarkSeconds)}
															</div>
														</div>
													</div>
												))}
												<div className="flex justify-between py-2 border-b border-slate-700">
													<span className="text-slate-400">Total Water</span>
													<span className="text-amber-100">
														{getTotalWater(selectedRecipe.pours)}ml
													</span>
												</div>
											</div>
											<div className="bg-slate-700 p-3 rounded-lg">
												<div className="text-slate-400">Ratio</div>
												<div className="text-amber-100">
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
								<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
									<label className="block mb-2 text-amber-100">
										Adjust Coffee Amount
									</label>
									<input
										type="tel"
										inputMode="numeric"
										value={adjustedCoffee ?? selectedRecipe.coffeeGrounds}
										onChange={(e) => setAdjustedCoffee(Number(e.target.value))}
										className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
										<div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-xl p-4 shadow-md border border-slate-600">
											<h3 className="mb-3 text-amber-100">Adjusted Recipe</h3>
											<div className="space-y-2 mb-3">
												<div className="flex justify-between py-2 border-b border-slate-600">
													<span className="opacity-90">Coffee</span>
													<span>{adjustedCoffee}g</span>
												</div>
												{adjustedPours.map((pour, index) => (
													<div
														key={pour.id}
														className="flex justify-between py-2 border-b border-slate-600"
													>
														<span className="opacity-90">Pour {index + 1}</span>
														<div className="text-right">
															<div>{pour.amount}ml</div>
															<div className="text-sm opacity-75">
																@ {formatTimeInput(pour.timeMarkSeconds)}
															</div>
														</div>
													</div>
												))}
												<div className="flex justify-between py-2 border-b border-slate-600">
													<span className="opacity-90">Total Water</span>
													<span>{getTotalWater(adjustedPours)}ml</span>
												</div>
											</div>
											<div className="bg-slate-600/50 p-3 rounded-lg">
												<div className="opacity-90">Ratio</div>
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
									<TimerIcon className="w-5 h-5" />
									Start Brewing
								</button>
							</>
						)}
					</div>
				)}

				{/* Timer View */}
				{view === "timer" && (
					<div className="space-y-6">
						{/* Recipe Summary */}
						<div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white rounded-xl p-4 shadow-md">
							<div className="flex items-center justify-between mb-2">
								<h3>{recipeName || "Current Recipe"}</h3>
								<div className="flex items-center gap-2">
									<Beaker className="w-4 h-4" />
									Ratio 1:{currentRatio}
								</div>
							</div>
							<div className="opacity-90">
								{coffeeGrounds}g coffee • {currentTotalWater}ml water •{" "}
								{pours.length} pours
							</div>
						</div>

						{/* Current Pour Indicator */}
						<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
							<div className="flex gap-2 mb-3">
								{pours.map((_, index) => (
									<div
										key={index}
										className={`flex-1 h-2 rounded-full transition-colors ${
											index < currentPourIndex
												? "bg-green-500"
												: index === currentPourIndex
													? "bg-amber-500"
													: "bg-slate-700"
										}`}
									/>
								))}
							</div>
							<div className="text-center text-slate-400">
								Pour {currentPourIndex + 1} of {pours.length}
							</div>
						</div>

						{/* Active Timer */}
						<Timer
							pourNumber={currentPourIndex + 1}
							totalPours={pours.length}
							amount={pours[currentPourIndex]?.amount || 0}
							timeMarkSeconds={pours[currentPourIndex]?.timeMarkSeconds || 0}
							onComplete={handlePourComplete}
							onReset={handleResetPour}
						/>

						{/* All Pours List */}
						<div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
							<h3 className="text-amber-100 mb-3">All Pours</h3>
							<div className="space-y-2">
								{pours.map((pour, index) => (
									<div
										key={pour.id}
										className={`flex justify-between items-center p-3 rounded-lg ${
											index === currentPourIndex
												? "bg-amber-700 border-2 border-amber-500"
												: index < currentPourIndex
													? "bg-green-900 border border-green-700"
													: "bg-slate-700 border border-slate-600"
										}`}
									>
										<span className="text-amber-100">
											Pour {index + 1}
											{index < currentPourIndex && " ✓"}
											{index === currentPourIndex && " (Active)"}
										</span>
										<div className="text-right">
											<div className="text-amber-100">{pour.amount}ml</div>
											<div className="text-slate-400 text-sm">
												@ {formatTimeInput(pour.timeMarkSeconds)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Completion */}
						{currentPourIndex >= pours.length && (
							<div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 shadow-md text-center">
								<h3 className="mb-2">Brewing Complete!</h3>
								<p className="opacity-90 mb-4">Enjoy your coffee</p>
								<div className="flex gap-2">
									<button
										onClick={() => setView("create")}
										className="flex-1 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
									>
										New Recipe
									</button>
									<button
										onClick={() => {
											handleResetPour();
										}}
										className="flex-1 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
									>
										Brew Again
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
