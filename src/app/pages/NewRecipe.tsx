import {
	Beaker,
	Plus,
	Save,
	Sparkles,
	Timer as TimerIcon,
	X,
} from "lucide-react";
import { useState } from "react";

interface Pour {
	id: string;
	amount: number;
	timeMarkSeconds: number;
}

interface BrewPreset {
	name: string;
	coffeeGrounds: number;
	pours: Pour[];
	description: string;
}

interface NewRecipeProps {
	recipeName: string;
	setRecipeName: (name: string) => void;
	coffeeGrounds: number;
	setCoffeeGrounds: (amount: number) => void;
	pours: Pour[];
	addPour: () => void;
	removePour: (id: string) => void;
	updatePourAmount: (id: string, amount: number) => void;
	updatePourTimeMark: (id: string, timeMarkSeconds: number) => void;
	saveRecipe: () => void;
	startBrewing: () => void;
	applyPreset: (preset: BrewPreset) => void;
	BREW_PRESETS: BrewPreset[];
	isDarkTheme: boolean;
	formatTimeInput: (seconds: number) => string;
	parseTimeInput: (timeString: string) => number;
	getTotalWater: (poursList: Pour[]) => number;
	calculateRatio: (coffee: number, totalWater: number) => string;
}

export function NewRecipe({
	recipeName,
	setRecipeName,
	coffeeGrounds,
	setCoffeeGrounds,
	pours,
	addPour,
	removePour,
	updatePourAmount,
	updatePourTimeMark,
	saveRecipe,
	startBrewing,
	applyPreset,
	BREW_PRESETS,
	isDarkTheme,
	formatTimeInput,
	parseTimeInput,
	getTotalWater,
	calculateRatio,
}: NewRecipeProps) {
	const [showPresets, setShowPresets] = useState(false);

	const themes = {
		card: isDarkTheme
			? "bg-slate-800 border-slate-700"
			: "bg-white border-amber-200",
		input: isDarkTheme
			? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500"
			: "bg-amber-50 border-amber-100 text-amber-900 placeholder-white-300",
		heading: isDarkTheme ? "text-white" : "text-amber-900",
		text: isDarkTheme ? "text-slate-400" : "text-amber-700",
		primaryBtn: isDarkTheme
			? "bg-amber-700 hover:bg-amber-600 text-white"
			: "bg-amber-600 hover:bg-amber-700 text-white",
	};

	const currentTotalWater = getTotalWater(pours);
	const currentRatio = calculateRatio(coffeeGrounds, currentTotalWater);

	return (
		<div className="space-y-6">
			{/* Brewing Method Presets */}
			<div className={`rounded-xl p-4 shadow-sm border mb-0 ${themes.card}`}>
				<button
					onClick={() => setShowPresets(!showPresets)}
					className={`w-full flex items-center justify-between ${themes.heading}`}
				>
					<span className="flex items-center gap-2">
						<Sparkles className="w-5 h-5" />
						Brewing Method Presets
					</span>
					<span className={themes.text}>{showPresets ? "−" : "+"}</span>
				</button>

				{showPresets && (
					<div className="mt-4 space-y-2">
						{BREW_PRESETS.map((preset) => (
							<a href="#recipe-name-section">
								<button
									key={preset.name}
									onClick={() => {
										applyPreset(preset);
										setShowPresets(false);
									}}
									className={`w-full text-left mb-3 p-3 rounded-lg border transition-colors ${
										isDarkTheme
											? "border-slate-700 hover:bg-slate-700"
											: "border-amber-100 hover:bg-amber-50"
									}`}
								>
									<div className={themes.heading}>{preset.name}</div>
									<div className={themes.text}>{preset.description}</div>
								</button>
							</a>
						))}
					</div>
				)}
			</div>

			<div id="recipe-name-section" className="h-1"></div>

			{/* Recipe Name */}
			<div className={`rounded-xl p-4 shadow-sm border ${themes.card}`}>
				<label className={`block mb-2 ${themes.heading}`}>Recipe Name</label>
				<input
					type="text"
					value={recipeName}
					onChange={(e) => setRecipeName(e.target.value)}
					placeholder="e.g., Morning V60"
					className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border ${themes.input}`}
				/>
			</div>

			{/* Coffee Grounds */}
			<div className={`rounded-xl p-4 shadow-sm border ${themes.card}`}>
				<label className={`block mb-2 ${themes.heading}`}>
					Coffee Grounds (g)
				</label>
				<input
					type="tel"
					inputMode="numeric"
					value={coffeeGrounds}
					onChange={(e) => setCoffeeGrounds(Number(e.target.value))}
					className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border ${themes.input}`}
				/>
			</div>

			{/* Pours */}
			<div className={`rounded-xl p-4 shadow-sm border ${themes.card}`}>
				<div className="flex items-center justify-between mb-2">
					<label className={themes.heading}>Pours</label>
					<button
						onClick={addPour}
						className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${themes.primaryBtn}`}
					>
						<Plus className="w-4 h-4" />
						Add Pour
					</button>
				</div>
				<p className={`${themes.text} text-sm mb-3`}>
					Enter water amount and time mark (mm:ss) for each pour
				</p>

				<div className="space-y-3">
					{pours.map((pour, index) => (
						<div
							key={pour.id}
							className={`space-y-2 rounded-lg border py-2 px-2 ${
								isDarkTheme
									? "bg-slate-700 border-slate-700"
									: "bg-amber-50 border-amber-100"
							}`}
						>
							<div className="flex items-center justify-between">
								<span className={`${themes.heading} text-sm sm:text-base pl-1`}>
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
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center mr-2 mb-1">
								<div className="flex items-center flex-1 mb-1">
									<input
										type="tel"
										inputMode="numeric"
										value={pour.amount}
										onChange={(e) =>
											updatePourAmount(pour.id, Number(e.target.value))
										}
										placeholder="Amount"
										className={`flex-1 px-1 sm:px-2 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border min-w-0 ${
											isDarkTheme
												? "bg-slate-600 border-slate-500 text-slate-100 placeholder-slate-500"
												: "bg-white border-amber-100 text-amber-900 placeholder-amber-500"
										}`}
									/>
									<span
										className={`ml-1 text-xs sm:text-sm whitespace-nowrap ${themes.text}`}
									>
										ml
									</span>
								</div>
								<div className="flex items-center flex-1 mb">
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
										className={`flex-1 px-1 sm:px-2 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border min-w-0 ${
											isDarkTheme
												? "bg-slate-600 border-slate-500 text-slate-100 placeholder-slate-500"
												: "bg-white border-amber-100 text-amber-900 placeholder-amber-500"
										}`}
									/>
									<TimerIcon
										className={`ml-1 w-4 h-4 flex-shrink-0 ${themes.text}`}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Current Ratio Display */}
			<div
				className={`${themes.card}  rounded-xl p-4 shadow-sm ${isDarkTheme ? "bg-slate-800" : "bg-amber-600"} ${themes.heading}`}
			>
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
					className={`flex-1 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md ${themes.primaryBtn}`}
				>
					<Save className="w-5 h-5" />
					Save Recipe
				</button>
			</div>
		</div>
	);
}
