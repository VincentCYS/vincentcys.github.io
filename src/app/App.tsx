import { Coffee, Moon, Sun, Timer as TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { NewRecipe } from "./pages/NewRecipe";
import { SavedRecipe } from "./pages/SavedRecipe";
import { StartBrew } from "./pages/StartBrew";

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
	const [isDarkTheme, setIsDarkTheme] = useState(true);

	// Load recipes from localStorage
	useEffect(() => {
		const savedRecipes = localStorage.getItem("coffeeRecipes");
		if (savedRecipes) {
			setRecipes(JSON.parse(savedRecipes));
		}

		// Load theme preference
		const savedTheme = localStorage.getItem("coffeeAppTheme");
		if (savedTheme !== null) {
			setIsDarkTheme(JSON.parse(savedTheme));
		}
	}, []);

	// Save recipes to localStorage
	const saveRecipesToStorage = (updatedRecipes: Recipe[]) => {
		localStorage.setItem("coffeeRecipes", JSON.stringify(updatedRecipes));
		setRecipes(updatedRecipes);
	};

	const toggleTheme = () => {
		const newTheme = !isDarkTheme;
		setIsDarkTheme(newTheme);
		localStorage.setItem("coffeeAppTheme", JSON.stringify(newTheme));
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
	};

	const startBrewing = () => {
		setCurrentPourIndex(0);
		setView("timer");
		if (selectedRecipe && !recipeName) {
			setRecipeName(selectedRecipe.name);
		}
	};

	const handlePourComplete = () => {
		if (currentPourIndex <= pours.length) {
			setCurrentPourIndex(currentPourIndex + 1);
		}
	};

	const handleResetPour = () => {
		setCurrentPourIndex(0);
	};

	// Update iOS status bar color based on theme
	useEffect(() => {
		document.body.style.backgroundColor = isDarkTheme ? "#0f172a" : "#fef3c7";
	}, [isDarkTheme]);

	const adjustedPours = getAdjustedPours();

	// Theme classes
	const themes = {
		bg: isDarkTheme
			? "from-slate-950 to-slate-900"
			: "from-amber-50 to-orange-50",
		card: isDarkTheme
			? "bg-slate-800 border-slate-700"
			: "bg-white border-amber-100",
		heading: isDarkTheme ? "text-white" : "text-amber-900",
		text: isDarkTheme ? "text-slate-400" : "text-amber-700",
		primaryBtn: isDarkTheme
			? "bg-amber-700 hover:bg-amber-600 text-white"
			: "bg-amber-600 hover:bg-amber-700 text-white",
		secondaryBtn: isDarkTheme
			? "bg-slate-700 hover:bg-slate-600 text-white border-slate-500"
			: "bg-white hover:bg-amber-50 text-amber-800 border-amber-200",
	};

	return (
		<div className={`min-h-screen bg-gradient-to-b ${themes.bg} p-4 pb-8`}>
			<div className="max-w-md mx-auto">
				{/* Header with Theme Toggle */}
				<div className="text-center mb-6 pt-4">
					<div className="flex items-center justify-between mb-4">
						{/* <div className="w-10"></div> */}
						<div className="flex items-center justify-center gap-2">
							<Coffee
								className={`w-8 h-8 ${isDarkTheme ? "text-amber-400" : "text-amber-600"}`}
							/>
							<h1 className={themes.heading}>Coffee Brew Guide</h1>
						</div>
						<button
							onClick={toggleTheme}
							className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
								isDarkTheme
									? "bg-slate-700 text-amber-400 hover:bg-slate-600"
									: "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
							}`}
							title={
								isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"
							}
						>
							{isDarkTheme ? (
								<Sun className="w-5 h-5" />
							) : (
								<Moon className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>

				{/* View Toggle */}
				<div className="flex gap-2 mb-6">
					<button
						onClick={() => setView("create")}
						className={`flex-1 py-3 px-2 rounded-lg transition-colors border text-sm md:text-base ${
							view === "create"
								? "bg-amber-600 text-white border-amber-600"
								: `${themes.secondaryBtn} border`
						}`}
					>
						New Recipe
					</button>
					<button
						onClick={() => setView("saved")}
						className={`flex-1 py-3 px-2 rounded-lg transition-colors border text-sm md:text-base ${
							view === "saved"
								? "bg-amber-600 text-white border-amber-600"
								: `${themes.secondaryBtn} border`
						}`}
					>
						Saved ({recipes.length})
					</button>
					<button
						onClick={() => setView("timer")}
						className={`flex-1 py-3 px-2 rounded-lg transition-colors border text-sm md:text-base ${
							view === "timer"
								? "bg-amber-600 text-white border-amber-600"
								: `${themes.secondaryBtn} border`
						}`}
					>
						<TimerIcon className="w-5 h-5 mx-auto" />
					</button>
				</div>

				{/* Create Recipe View */}
				{view === "create" && (
					<NewRecipe
						recipeName={recipeName}
						setRecipeName={setRecipeName}
						coffeeGrounds={coffeeGrounds}
						setCoffeeGrounds={setCoffeeGrounds}
						pours={pours}
						addPour={addPour}
						removePour={removePour}
						updatePourAmount={updatePourAmount}
						updatePourTimeMark={updatePourTimeMark}
						saveRecipe={saveRecipe}
						startBrewing={startBrewing}
						applyPreset={applyPreset}
						BREW_PRESETS={BREW_PRESETS}
						isDarkTheme={isDarkTheme}
						formatTimeInput={formatTimeInput}
						parseTimeInput={parseTimeInput}
						getTotalWater={getTotalWater}
						calculateRatio={calculateRatio}
					/>
				)}

				{/* Saved Recipes View */}
				{view === "saved" && (
					<SavedRecipe
						recipes={recipes}
						selectedRecipeId={selectedRecipeId}
						selectRecipe={selectRecipe}
						deleteRecipe={deleteRecipe}
						selectedRecipe={selectedRecipe}
						adjustedCoffee={adjustedCoffee}
						setAdjustedCoffee={setAdjustedCoffee}
						adjustedPours={adjustedPours}
						startBrewing={startBrewing}
						isDarkTheme={isDarkTheme}
						setView={setView}
						formatTimeInput={formatTimeInput}
						getTotalWater={getTotalWater}
						calculateRatio={calculateRatio}
						setCoffeeGrounds={setCoffeeGrounds}
						setPours={setPours}
					/>
				)}

				{/* Timer View */}
				{view === "timer" && (
					<StartBrew
						recipeName={recipeName}
						coffeeGrounds={coffeeGrounds}
						pours={pours}
						currentPourIndex={currentPourIndex}
						handlePourComplete={handlePourComplete}
						handleResetPour={handleResetPour}
						isDarkTheme={isDarkTheme}
						setView={setView}
						formatTimeInput={formatTimeInput}
						getTotalWater={getTotalWater}
						calculateRatio={calculateRatio}
					/>
				)}
			</div>
		</div>
	);
}
