import { Search, Plus } from "lucide-react";
import { UI_LABELS } from "@/constants/ui.constants";

interface TaskToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  priorityFilter: string;
  onPriorityChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onAddTaskClick: () => void;
}

export function TaskToolbar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortByChange,
  onAddTaskClick,
}: TaskToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-zinc-900 border border-border rounded-xl">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={UI_LABELS.TASK.TOOLBAR.SEARCH_PLACEHOLDER}
          className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-border focus:border-primary rounded-md outline-none text-sm transition text-white"
        />
      </div>

      {/* Selectors and Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-secondary/25 border border-border focus:border-primary rounded-md outline-none text-xs text-white transition"
        >
          <option value="ALL" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.FILTER_STATUS}</option>
          <option value="TO_DO" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.TO_DO}</option>
          <option value="IN_PROGRESS" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.IN_PROGRESS}</option>
          <option value="COMPLETED" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.COMPLETED}</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3 py-2 bg-secondary/25 border border-border focus:border-primary rounded-md outline-none text-xs text-white transition"
        >
          <option value="ALL" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.FILTER_PRIORITY}</option>
          <option value="LOW" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.LOW}</option>
          <option value="MEDIUM" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.MEDIUM}</option>
          <option value="HIGH" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.HIGH}</option>
        </select>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-muted-foreground whitespace-nowrap">{UI_LABELS.TASK.TOOLBAR.SORT_BY}:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-3 py-2 bg-secondary/25 border border-border focus:border-primary rounded-md outline-none text-xs text-white transition"
          >
            <option value="created_at" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.SORT_CREATED_AT}</option>
            <option value="due_date" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.SORT_DUE_DATE}</option>
            <option value="priority" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.SORT_PRIORITY}</option>
          </select>
        </div>

        {/* Add Task Trigger */}
        <button
          onClick={onAddTaskClick}
          className="py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/95 transition flex items-center justify-center space-x-1.5 text-xs"
        >
          <Plus size={14} />
          <span>{UI_LABELS.TASK.TOOLBAR.ADD_TASK_BUTTON}</span>
        </button>
      </div>
    </div>
  );
}
