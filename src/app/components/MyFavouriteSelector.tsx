"use client";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Select, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { receips } from "../constants/defaultRecipes";
import { InputsContext } from "../contexts/InputsContext";
import styles from "../page.module.css";
import { InputsContextType } from "../types/InputsContextType";
import { Recipe } from "../types/Recipe";

const { Title } = Typography;

export default function MyFavouriteSelector() {
	const [recipeName, setRecipeName] = useState("");
	const {
		setInputs,
		setGroundsInput,
		favorites,
		setFavorites,
	}: InputsContextType = useContext(InputsContext);

	const loadRecipe = (recipe: Recipe) => {
		// Set recipe name
		setRecipeName(recipe.label);

		// Set grounds input
		setGroundsInput(recipe.grounds);

		// Set water amounts
		setInputs(
			recipe.waterAmounts.map((amount) => ({
				id: amount.id,
				placeholder: "water amount",
				value: amount.value,
			}))
		);
	};

	const deleteRecipe = (id: string) => {
		const updatedFavorites = favorites.filter((recipe) => recipe.value !== id);
		setFavorites(updatedFavorites);

		localStorage.setItem(
			"coffeeRecipes",
			JSON.stringify(
				updatedFavorites.slice(receips.length, updatedFavorites.length)
			)
		);

		// Clear current recipe if it's the one being deleted
		if (favorites.find((recipe) => recipe.value === id)?.label === recipeName) {
			setRecipeName("");
			setGroundsInput("");
			setInputs([{ id: 1, placeholder: "water amount", value: "" }]);
		}
	};

	useEffect(() => {
		const loadFavorites = () => {
			const saved = localStorage.getItem("coffeeRecipes");
			if (saved && favorites.length === 3) {
				const fav = favorites.concat(JSON.parse(saved));
				setFavorites(fav);
			}
		};

		loadFavorites();
	}, []);

	return (
		<div className={styles.favoritesSection}>
			<Title level={5}>My Favorites</Title>
			<div className={styles.favoritesWrapper}>
				<Select
					onChange={(id) => {
						const recipe = favorites.find((r) => r.value === id);
						if (recipe) loadRecipe(recipe);
					}}
					options={favorites}
					placeholder="Select recipe"
					style={{ width: "100%" }}
				/>

				{favorites.find((recipe) => recipe.label === recipeName) && (
					<Button
						type="text"
						danger
						onClick={() => {
							const recipe = favorites.find((r) => r.label === recipeName);
							if (recipe) deleteRecipe(recipe.value);
						}}
						icon={<DeleteOutlined />}
					/>
				)}
			</div>
		</div>
	);
}
