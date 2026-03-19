import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface TimerProps {
	pourNumber: number;
	totalPours: number;
	amount: number;
	timeMarkSeconds: number;
	onComplete: () => void;
	onReset: () => void;
}

export function Timer({
	pourNumber,
	totalPours,
	amount,
	timeMarkSeconds,
	onComplete,
	onReset,
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
		if (totalPours == pourNumber + 1) {
			setIsRunning(false);
		}
		onComplete();
	};

	return (
		<div className="bg-slate-800 rounded-xl p-6 shadow-md border border-slate-700">
			<div className="text-center mb-6">
				<div className="text-6xl font-bold text-amber-100 font-mono mb-2">
					{formatTime(seconds)}
				</div>
				<div className="text-slate-400">
					Pour {pourNumber} of {totalPours}
				</div>
			</div>

			{/* Target Amount */}
			<div className="bg-slate-700 rounded-lg p-4 mb-6 text-center">
				<div className="text-slate-400 text-sm mb-1">Target Amount</div>
				<div className="text-2xl font-bold text-amber-100">{amount}ml</div>
			</div>

			{/* Control Buttons */}
			<div className="flex gap-3 mb-4">
				<button
					onClick={() => setIsRunning(!isRunning)}
					className={`flex-1 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
						isRunning
							? "bg-amber-700 hover:bg-amber-600 text-white"
							: "bg-amber-800 text-white hover:bg-amber-900"
					}`}
				>
					{isRunning ? (
						<>
							<Pause className="w-4 h-4" />
							Pause
						</>
					) : (
						<>
							<Play className="w-4 h-4" />
							Start
						</>
					)}
				</button>
				<button
					onClick={reset}
					className="flex-1 bg-slate-700 hover:bg-slate-600 text-amber-100 rounded-lg font-semibold transition-colors"
				>
					<RotateCcw className="w-full w-4 h-4" />
				</button>
			</div>

			{/* Complete Button */}
			<button
				onClick={handleComplete}
				disabled={(pourNumber === 1 && !isRunning) || pourNumber > totalPours}
				className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
			>
				Pour Complete
			</button>
		</div>
	);
}
