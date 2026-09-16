import { useEffect } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { useBranchesDropdown } from '@/modules/Branches/hooks/useBranches';
import { useBranchStore } from '@/app/providers/branchStore';

export function BranchSwitcher() {
  const { data: branches, isLoading } = useBranchesDropdown();
  const { selectedBranch, setSelectedBranch } = useBranchStore();

  useEffect(() => {
    if (!selectedBranch && branches && branches.length > 0) {
      setSelectedBranch(branches[0]);
    }
  }, [branches, selectedBranch, setSelectedBranch]);

  if (isLoading) {
    return <div className="h-9 w-40 animate-pulse rounded-md bg-neutral-200" />;
  }

  if (!branches || branches.length === 0) {
    return <span className="text-sm text-neutral-400">لا توجد فروع</span>;
  }

  return (
    <div className="relative">
      <select
        value={selectedBranch?.id ?? ''}
        onChange={(e) => {
          const branch = branches.find((b) => b.id === e.target.value);
          if (branch) setSelectedBranch(branch);
        }}
        className="h-9 appearance-none rounded-md border border-neutral-300 bg-white ps-8 pe-3 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.branchName}
          </option>
        ))}
      </select>
      <Building2 className="pointer-events-none absolute start-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <ChevronDown className="pointer-events-none absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </div>
  );
}
