import { create } from "zustand";
import { FlexBoxTree } from "./flexUtil";

interface SelectedStore {
	selected: FlexBoxTree | null;
	setSelected: (selected: FlexBoxTree | null) => void;
}

export const useSelectedStore = create<SelectedStore>((set) => ({
	selected: null,
	setSelected: (selected) => set({ selected }),
}));
