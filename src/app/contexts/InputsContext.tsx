import { createContext } from "react";
import { receips } from "../constants/defaultRecipes";
import { InputsContextType } from "../types/InputsContextType";

export const InputsContext = createContext<InputsContextType>({
	inputs: [],
	setInputs: () => {},
	groundsInput: "",
	setGroundsInput: () => {},
	favorites: receips,
	setFavorites: () => {},
});
