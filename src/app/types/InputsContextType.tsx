import { Recipe } from "./Recipe";

export interface InputsContextType {
	inputs: Array<{ id: number; placeholder: string; value: string }>;
	setInputs: React.Dispatch<
		React.SetStateAction<
			Array<{ id: number; placeholder: string; value: string }>
		>
	>;
	groundsInput: string;
	setGroundsInput: React.Dispatch<React.SetStateAction<string>>;
	favorites: Recipe[];
	setFavorites: React.Dispatch<React.SetStateAction<Recipe[]>>;
}
