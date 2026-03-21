import { Beaker } from "lucide-react";
import { useState } from "react";
import { Timer } from "../components/Timer";

interface Pour {
	id: string;
	amount: number;
	timeMarkSeconds: number;
}

interface StartBrewProps {
	recipeName: string;
	coffeeGrounds: number;
	pours: Pour[];
	currentPourIndex: number;
	handlePourComplete: () => void;
	handleResetPour: () => void;
	isDarkTheme: boolean;
	setView: (view: "create" | "saved" | "timer") => void;
	formatTimeInput: (seconds: number) => string;
	getTotalWater: (poursList: Pour[]) => number;
	calculateRatio: (coffee: number, totalWater: number) => string;
}

export function StartBrew({
	recipeName,
	coffeeGrounds,
	pours,
	currentPourIndex,
	handlePourComplete,
	handleResetPour,
	isDarkTheme,
	setView,
	formatTimeInput,
	getTotalWater,
	calculateRatio,
}: StartBrewProps) {
	const themes = {
		card: isDarkTheme
			? "bg-slate-800 border-slate-700"
			: "bg-white border-amber-100",
		heading: isDarkTheme ? "text-white" : "text-amber-900",
		text: isDarkTheme ? "text-slate-400" : "text-amber-700",
	};

	const currentTotalWater = getTotalWater(pours);
	const currentRatio = calculateRatio(coffeeGrounds, currentTotalWater);

	const [showDetails, setShowDetails] = useState<boolean>(false);

	return (
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
					{coffeeGrounds}g coffee • {currentTotalWater}ml water • {pours.length}{" "}
					pours
				</div>
			</div>

			<div className={`rounded-xl p-4 shadow-sm border ${themes.card}`}>
				<button
					onClick={() => setShowDetails(!showDetails)}
					className={`w-full flex items-center justify-between ${themes.heading}`}
				>
					<span className="flex items-center gap-2">Recipe Details</span>
					<span className={themes.text}>{showDetails ? "−" : "+"}</span>
				</button>

				{showDetails && (
					<div className="mt-4 space-y-2">
						{/* All Pours List */}
						<div className="space-y-2">
							{pours.map((pour, index) => (
								<div
									key={pour.id}
									className={`flex justify-between items-center p-3 rounded-lg border ${
										index === currentPourIndex
											? isDarkTheme
												? "bg-amber-700 border-amber-500"
												: "bg-amber-200 border-amber-400"
											: isDarkTheme
												? "bg-slate-700 border-slate-600"
												: "bg-amber-50 border-amber-100"
									}`}
								>
									<span className={themes.heading}>
										Pour {index + 1}
										{index === currentPourIndex && " (Active)"}
									</span>
									<div className="text-right">
										<div className={themes.heading}>{pour.amount}ml</div>
										<div className={`text-sm ${themes.text}`}>
											@ {formatTimeInput(pour.timeMarkSeconds)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Active Timer */}
			<Timer
				pourNumber={currentPourIndex}
				totalPours={pours.length}
				amount={pours[currentPourIndex]?.amount || 0}
				timeMarkSeconds={pours[currentPourIndex]?.timeMarkSeconds || 0}
				onComplete={handlePourComplete}
				onReset={handleResetPour}
				isDarkTheme={isDarkTheme}
			/>

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
	);
}
