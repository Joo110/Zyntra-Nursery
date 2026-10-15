import { create } from 'zustand';
import type { BranchDropdownDto } from '@/modules/Branches/types/branch.types';

const BRANCH_STORAGE_KEY = 'zyntra_selected_branch';

interface BranchState {
  selectedBranch: BranchDropdownDto | null;
  setSelectedBranch: (branch: BranchDropdownDto) => void;
  clearSelectedBranch: () => void;
}

function readStoredBranch(): BranchDropdownDto | null {
  try {
    const raw = localStorage.getItem(BRANCH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BranchDropdownDto) : null;
  } catch {
    return null;
  }
}

export const useBranchStore = create<BranchState>((set) => ({
  selectedBranch: readStoredBranch(),
  setSelectedBranch: (branch) => {
    localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(branch));
    set({ selectedBranch: branch });
  },
  clearSelectedBranch: () => {
    localStorage.removeItem(BRANCH_STORAGE_KEY);
    set({ selectedBranch: null });
  },
}));
