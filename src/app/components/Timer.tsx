import { useEffect, useState } from "react";

interface TimerProps {
	pourNumber: number;
	totalPours: number;
	amount: number;
	timeMarkSeconds: number;
	onComplete: () => void;
	onReset: () => void;
	isDarkTheme: boolean;
}

export function Timer({
	pourNumber,
	totalPours,
	amount,
	onComplete,
	onReset,
	isDarkTheme,
}: TimerProps) {
	const [seconds, setSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isRunning) {
			interval = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isRunning]);

	const formatTime = (totalSeconds: number) => {
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const reset = () => {
		setSeconds(0);
		setIsRunning(false);
		onReset();
	};

	const handleComplete = () => {
		if (pourNumber >= totalPours) {
			setIsRunning(false);
		}
		onComplete();
	};

	return (
		<div
			className={`rounded-xl p-6 shadow-md border ${isDarkTheme ? "bg-slate-800 border-slate-700" : "bg-white border-amber-100"}`}
		>
			<div className="text-center mb-6">
				<div
					className={`text-6xl font-bold font-mono mb-2 ${isDarkTheme ? "text-amber-100" : "text-amber-900"}`}
				>
					{formatTime(seconds)}
				</div>
				<div className={isDarkTheme ? "text-slate-400" : "text-amber-700"}>
					Pour {pourNumber} of {totalPours}
				</div>
			</div>

			{/* Target Amount */}
			<div
				className={`rounded-lg p-4 mb-6 text-center ${isDarkTheme ? "bg-slate-700" : "bg-amber-50"}`}
			>
				<div
					className={
						isDarkTheme
							? "text-slate-400 text-sm mb-1"
							: "text-amber-700 text-sm mb-1"
					}
				>
					Target Amount
				</div>
				<div
					className={`text-2xl font-bold ${isDarkTheme ? "text-amber-100" : "text-amber-900"}`}
				>
					{amount}ml
				</div>
			</div>

			{/* Control Buttons */}
			<div className="flex gap-3 mb-4">
				<button
					onClick={() => setIsRunning(!isRunning)}
					disabled={pourNumber > totalPours}
					className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
						isDarkTheme
							? "bg-amber-700 hover:bg-amber-600 text-white disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
							: "bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
					} `}
				>
					{isRunning ? "Pause" : "Start"}
				</button>
				<button
					onClick={reset}
					className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
						isDarkTheme
							? "bg-slate-700 hover:bg-slate-600 text-amber-100"
							: "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
					}`}
				>
					Reset
				</button>
			</div>

			{/* Complete Button */}
			<button
				onClick={handleComplete}
				disabled={(pourNumber === 1 && !isRunning) || pourNumber > totalPours}
				className={`w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors 
				${
					isDarkTheme
						? "disabled:text-gray-400 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600"
						: "disabled:text-gray-400 disabled:cursor-not-allowed disabled:from-gray-200 disabled:to-gray-200"
				}`}
			>
				Pour Complete
			</button>
		</div>
	);
}
