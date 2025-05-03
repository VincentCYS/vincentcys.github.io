"use client";
import styles from "../page.module.css";

export default function RatioDisplay(props: {
	groundsInput: string;
	inputs: {
		id: number;
		placeholder: string;
		value: string;
	}[];
}) {
	return (
		<div className={styles.ratioDisplay}>
			{parseFloat(props.inputs[props.inputs.length - 1]?.value) &&
			parseFloat(props.groundsInput) ? (
				<>
					<h3 className={styles.ratioTitle}>Water to Coffee Ratio</h3>
					<div className={styles.ratioValue}>
						<span>1</span>
						<span>:</span>
						<span>
							{(
								parseFloat(props.inputs[props.inputs.length - 1].value) /
								parseFloat(props.groundsInput)
							).toFixed(1)}
						</span>
					</div>
				</>
			) : (
				<div className={styles.ratioPlaceholder}>
					Enter coffee and water amounts to see ratio
				</div>
			)}
		</div>
	);
}
