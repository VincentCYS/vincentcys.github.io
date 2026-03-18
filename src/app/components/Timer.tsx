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
		if (totalPours == pourNumber) {
			setIsRunning(false);
		}
		onComplete();
	};

	const timeDifference = seconds - timeMarkSeconds;
	const isOnTime = Math.abs(timeDifference) <= 5;
	const isAhead = timeDifference < -5;
	const isBehind = timeDifference > 5;

	return (
		<div className="bg-white rounded-lg p-4 border-2 border-amber-200">
			<div className="flex items-center justify-between mb-3">
				<div>
					<div className="text-amber-900">Pour {pourNumber}</div>
					<div className="text-muted-foreground">{amount}ml</div>
				</div>
				<div className="text-right">
					<div className="text-amber-800 text-2xl">{formatTime(seconds)}</div>
					<div className="text-muted-foreground text-sm">
						Target: {formatTime(timeMarkSeconds)}
					</div>
				</div>
			</div>

			<div className="flex gap-2">
				<button
					onClick={() => setIsRunning(!isRunning)}
					className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
						isRunning
							? "bg-amber-100 text-amber-800 hover:bg-amber-200"
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
					className="py-2 px-4 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
				>
					<RotateCcw className="w-4 h-4" />
				</button>
				{
					<button
						onClick={handleComplete}
						disabled={pourNumber === 1 && !isRunning}
						className="py-2 px-4 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
					>
						Done
					</button>
				}
			</div>
		</div>
	);
}
