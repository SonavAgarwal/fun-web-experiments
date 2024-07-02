import { create } from "zustand";
import { FlexBoxTree } from "./FlexPage";

interface SelectedStore {
	selected: FlexBoxTree | null;
	setSelected: (selected: FlexBoxTree) => void;
}

export const useSelectedStore = create<SelectedStore>((set) => ({
	selected: null,
	setSelected: (selected) => set({ selected }),
}));
