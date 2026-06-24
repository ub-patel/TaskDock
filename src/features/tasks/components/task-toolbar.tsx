import { Search, Plus } from "lucide-react";
import { UI_LABELS } from "@/constants";
import { Card, Input, Select, Button } from "@/components/shared";
import { sanitizeSearch } from "@/utils";
import { useProfiles } from "@/store/task.store";

interface TaskToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  priorityFilter: string;
  onPriorityChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  assigneeFilter: string;
  onAssigneeChange: (val: string) => void;
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
  assigneeFilter,
  onAssigneeChange,
  sortBy,
  onSortByChange,
  onAddTaskClick,
}: TaskToolbarProps): React.JSX.Element {
  const profiles = useProfiles();

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-border rounded-xl">
      <div className="relative flex-1 max-w-sm w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
          <Search size={16} />
        </span>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(sanitizeSearch(e.target.value))}
          placeholder={UI_LABELS.TASK.TOOLBAR.SEARCH_PLACEHOLDER}
          className="pl-10 bg-secondary/20"
        />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto">
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          containerClassName="w-full sm:w-[130px]"
          className="text-xs py-1.5 h-[34px] w-full"
        >
          <option value="ALL" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.FILTER_STATUS}</option>
          <option value="TO_DO" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.TO_DO}</option>
          <option value="IN_PROGRESS" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.IN_PROGRESS}</option>
          <option value="COMPLETED" className="bg-zinc-900">{UI_LABELS.TASK.STATUS.COMPLETED}</option>
        </Select>

        <Select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          containerClassName="w-full sm:w-[135px]"
          className="text-xs py-1.5 h-[34px] w-full"
        >
          <option value="ALL" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.FILTER_PRIORITY}</option>
          <option value="LOW" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.LOW}</option>
          <option value="MEDIUM" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.MEDIUM}</option>
          <option value="HIGH" className="bg-zinc-900">{UI_LABELS.TASK.PRIORITY.HIGH}</option>
        </Select>

        <Select
          value={assigneeFilter}
          onChange={(e) => onAssigneeChange(e.target.value)}
          containerClassName="w-full sm:w-[145px]"
          className="text-xs py-1.5 h-[34px] w-full"
        >
          <option value="ALL" className="bg-zinc-900">All Assignees</option>
          <option value="ME" className="bg-zinc-900">Assigned to Me</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id} className="bg-zinc-900">
              {p.fullName}
            </option>
          ))}
        </Select>

        <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
          <span className="text-muted-foreground whitespace-nowrap">{UI_LABELS.TASK.TOOLBAR.SORT_BY}:</span>
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            containerClassName="w-full sm:w-[125px]"
            className="text-xs py-1.5 h-[34px] w-full"
          >
            <option value="created_at" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.SORT_CREATED_AT}</option>
            <option value="due_date" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.SORT_DUE_DATE}</option>
            <option value="priority" className="bg-zinc-900">{UI_LABELS.TASK.TOOLBAR.SORT_PRIORITY}</option>
          </Select>
        </div>

        <Button
          onClick={onAddTaskClick}
          size="sm"
          className="h-[34px] font-semibold w-full sm:w-auto shrink-0"
        >
          <Plus size={14} />
          <span>{UI_LABELS.TASK.TOOLBAR.ADD_TASK_BUTTON}</span>
        </Button>
      </div>
    </Card>
  );
}

