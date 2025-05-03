"use client";
import { DeleteOutlined, StarOutlined, SyncOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import {
	Button,
	Divider,
	Input,
	InputNumber,
	message,
	Modal,
	Row,
	Space,
	Table,
	Typography,
} from "antd";
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

import { InputsContext } from "../contexts/InputsContext";
import styles from "../page.module.css";
import { InputsContextType } from "../types/InputsContextType";
import RatioDisplay from "./RatioDisplay";

const { Text, Title } = Typography;

export default function RecipeForm(props: {
	saveRecipe: () => void;
	recipeName: string;
	setRecipeName: Dispatch<SetStateAction<string>>;
}) {
	const [targetGroundsInput, setTargetGroundsInput] = useState("");
	const [tableData, setTableData] = useState<TableDataType[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	const {
		inputs,
		setInputs,
		groundsInput,
		setGroundsInput,
	}: InputsContextType = useContext(InputsContext);

	useEffect(() => {
		const recalculateWaterAmounts = (value: string) => {
			// Convert inputs to numbers
			const originalGrounds = parseFloat(groundsInput);
			const targetGrounds = parseFloat(value);

			if (
				isNaN(originalGrounds) ||
				isNaN(targetGrounds) ||
				originalGrounds === 0
			) {
				setTableData([]);
				return;
			}

			// Calculate ratio between target and original grounds
			const ratio = targetGrounds / originalGrounds;

			const data: TableDataType[] = [];
			// Calculate new water amounts
			inputs.map((input) => {
				const originalWater = parseFloat(input.value);

				if (isNaN(originalWater)) return "";

				data.push({
					key: input.id.toString(),
					original: originalWater,
					target: (originalWater * ratio).toFixed(1),
					symbol: "→",
				});

				return (originalWater * ratio).toFixed(1);
			});

			setTableData(data);
		};

		recalculateWaterAmounts(targetGroundsInput);
	}, [inputs, groundsInput, targetGroundsInput]);

	const handleAddInput = () => {
		if (inputs.length < 10) {
			const newId = inputs[inputs.length - 1].id + 1;
			setInputs([...inputs, { id: newId, placeholder: "", value: "" }]);
		}
	};

	const handleRemoveInput = (id: number) => {
		if (inputs.length > 1) {
			setInputs(inputs.filter((input) => input.id !== id));
			setTableData((prev) => prev.filter((data) => data.key !== id.toString()));
		}
	};

	const handleInputChange = (id: number, value: string) => {
		setInputs(
			inputs.map((input) => {
				if (input.id === id) {
					return { ...input, value };
				} else {
					return input;
				}
			})
		);
	};

	const success = () => {
		messageApi.open({
			type: "success",
			content: "Recipe saved successfully!",
		});
	};

	interface TableDataType {
		key: string;
		original: number;
		target: string;
		symbol: string;
	}

	const columns: TableProps<TableDataType>["columns"] = [
		{
			title: "Orignial",
			dataIndex: "original",
			key: "original",
		},
		{
			title: "",
			dataIndex: "symbol",
			key: "symbol",
			render: () => (
				<div
					style={{
						color: "#0070f3",
					}}
				>
					→
				</div>
			),
		},
		{
			title: "Target",
			dataIndex: "target",
			key: "target",
		},
	];

	return (
		<>
			<Row
				align="middle"
				justify="space-between"
				style={{ marginBottom: "1rem" }}
			>
				<Title level={5}>1. Enter Original Brewing Recipe</Title>
				<Button
					type="text"
					onClick={() => setIsModalOpen(true)}
					disabled={!groundsInput || inputs.some((input) => !input.value)}
					icon={<StarOutlined />}
				/>
			</Row>
			<Text>Coffee grounds</Text>
			<InputNumber
				key={"groundsInput"}
				type="number"
				placeholder="Coffee grounds"
				value={groundsInput}
				onChange={(e) => setGroundsInput(e?.toString() || "")}
				style={{ width: "100%", marginBottom: "1rem" }}
				addonAfter={"g"}
			/>
			<Text>Water per pour</Text>
			{inputs.map((input) => (
				<div
					key={input.id}
					className={styles.inputGroup}
					style={{ width: "100%", marginRight: "6rem" }}
				>
					<InputNumber
						type="number"
						value={input.value}
						onChange={(e) => handleInputChange(input.id, e || "")}
						placeholder="Water"
						style={{ width: "100%" }}
						addonAfter={"ml"}
					/>
					<Button
						type="text"
						danger
						shape="circle"
						onClick={() => handleRemoveInput(input.id)}
						icon={<DeleteOutlined />}
						disabled={inputs.length <= 1}
					/>
				</div>
			))}
			<Button
				type="dashed"
				onClick={handleAddInput}
				style={{ width: "100%", marginBottom: "1rem" }}
			>
				+
			</Button>
			<Button
				type="text"
				onClick={() => {
					setGroundsInput("");
					setInputs([{ id: 1, placeholder: "", value: "" }]);
				}}
				style={{ width: "100%", marginBottom: "1rem" }}
				icon={<SyncOutlined />}
			>
				Reset
			</Button>
			<Space direction="vertical" style={{ width: "100%" }}></Space>
			<Divider />
			<Title level={5} style={{ marginBottom: "1rem" }}>
				2. Enter Target Brewing Recipe
			</Title>
			<Text>Target coffee grounds</Text>
			<InputNumber
				key={"targetGroundsInput"}
				type="number"
				onChange={(e) => setTargetGroundsInput(e?.toString() || "")}
				disabled={!groundsInput}
				style={{ width: "100%" }}
				addonAfter={"g"}
			/>
			<Divider />
			<Title level={5} style={{ marginBottom: "1rem" }}>
				3. Result
			</Title>
			<RatioDisplay inputs={inputs} groundsInput={groundsInput} />

			<Text style={{ marginBottom: "1rem" }}>Recalculated Water Amounts</Text>
			{/* Table for displaying recalculated water amounts */}
			<Table<TableDataType>
				pagination={false}
				columns={columns}
				dataSource={tableData}
				style={{ marginBottom: "10rem" }}
			/>
			{/* Modal for saving recipe */}
			<Modal
				open={isModalOpen}
				title="Save Recipe"
				onCancel={() => {
					setIsModalOpen(false);
					props.setRecipeName("");
				}}
				footer={(_, { CancelBtn }) => (
					<>
						<CancelBtn />
						<Button
							type="primary"
							onClick={() => {
								props.saveRecipe();
								setIsModalOpen(false);
								success();
							}}
							disabled={!props.recipeName}
						>
							Save
						</Button>
					</>
				)}
			>
				<Input
					type="text"
					value={props.recipeName}
					onChange={(e) => props.setRecipeName(e.target.value)}
					placeholder="Enter recipe name"
					autoFocus
				/>
			</Modal>
			{contextHolder}
		</>
	);
}
