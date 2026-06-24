import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, id, containerClassName, value, defaultValue, onChange, ...props }, ref) => {
    const isDateInput = type === "date";

    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const [alignRight, setAlignRight] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
      if (value !== undefined) return value as string;
      if (defaultValue !== undefined) return defaultValue as string;
      return "";
    });

    const [currentMonth, setCurrentMonth] = useState<Date>(() => {
      const initialDate = selectedDateStr ? new Date(selectedDateStr) : new Date();
      return isNaN(initialDate.getTime()) ? new Date() : initialDate;
    });

    useEffect(() => {
      if (value !== undefined) {
        setSelectedDateStr(value as string);
        const parsed = new Date(value as string);
        if (!isNaN(parsed.getTime())) {
          setCurrentMonth(parsed);
        }
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isDateInput) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDateInput]);

    useEffect(() => {
      const updatePosition = () => {
        if (isOpen && triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const popoverHeight = 320;
          if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
            setOpenUpwards(true);
          } else {
            setOpenUpwards(false);
          }

          const spaceRight = window.innerWidth - rect.left;
          const popoverWidth = 280;
          if (spaceRight < popoverWidth && rect.right > popoverWidth) {
            setAlignRight(true);
          } else {
            setAlignRight(false);
          }
        }
      };

      if (isOpen) {
        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, { capture: true });
      }

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, { capture: true });
      };
    }, [isOpen]);

    if (!isDateInput) {
      return (
        <div className={cn("w-full space-y-1", containerClassName)}>
          {label && (
            <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor={id}>
              {label}
            </label>
          )}
          <input
            type={type}
            id={id}
            className={cn(
              "w-full px-4 py-2.5 bg-zinc-900/60 border border-white/10 hover:border-white/20 focus:border-primary rounded-xl outline-none text-sm transition text-white placeholder:text-muted-foreground/60 disabled:opacity-50",
              error && "border-rose-500 focus:border-rose-500",
              className
            )}
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            {...props}
          />
          {error && <span className="text-xs text-rose-500 block">{error}</span>}
        </div>
      );
    }

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const generateCalendarCells = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      const daysInCurrentMonth = getDaysInMonth(year, month);
      const firstDayOfWeek = getFirstDayOfMonth(year, month);

      const cells: { date: Date; isCurrentMonth: boolean }[] = [];

      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        cells.push({
          date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
          isCurrentMonth: false,
        });
      }

      for (let i = 1; i <= daysInCurrentMonth; i++) {
        cells.push({
          date: new Date(year, month, i),
          isCurrentMonth: true,
        });
      }

      const totalCells = 42;
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const nextDaysNeeded = totalCells - cells.length;
      for (let i = 1; i <= nextDaysNeeded; i++) {
        cells.push({
          date: new Date(nextYear, nextMonth, i),
          isCurrentMonth: false,
        });
      }

      return cells;
    };

    const handleSelectDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;

      setSelectedDateStr(formatted);
      setIsOpen(false);

      if (hiddenInputRef.current) {
        const nativeInput = hiddenInputRef.current;
        nativeInput.value = formatted;

        const event = new Event("change", { bubbles: true });
        Object.defineProperty(event, "target", {
          writable: true,
          value: nativeInput,
        });

        nativeInput.dispatchEvent(event);
        if (onChange) {
          onChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    const changeMonth = (offset: number) => {
      const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
      setCurrentMonth(next);
    };

    const cells = generateCalendarCells();
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const formattedDisplayDate = selectedDateStr
      ? new Date(selectedDateStr).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Select due date...";

    return (
      <div className={cn("w-full space-y-1 relative", containerClassName)} ref={containerRef}>
        {label && (
          <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor={id}>
            {label}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            ref={triggerRef}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full px-4 py-2.5 bg-zinc-900/60 border border-white/10 hover:border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/25 rounded-xl outline-none text-sm transition text-white flex items-center justify-between cursor-pointer disabled:opacity-50 text-left h-[44px]",
              isOpen && "border-primary",
              error && "border-rose-500 focus:border-rose-500",
              className
            )}
          >
            <span className={cn("truncate min-w-0 flex-1 mr-2", selectedDateStr ? "text-white" : "text-muted-foreground/60")}>
              {formattedDisplayDate}
            </span>
            <CalendarIcon size={16} className="text-muted-foreground shrink-0" />
          </button>

          <input
            id={id}
            type="date"
            ref={(node) => {
              hiddenInputRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            value={selectedDateStr}
            onChange={() => {}}
            className="sr-only"
            {...props}
          />

          {isOpen && (
            <div
              className={cn(
                "absolute w-[280px] bg-zinc-950/95 border border-white/5 shadow-2xl rounded-xl p-4 z-[9999] backdrop-blur-xl animate-fade-in space-y-3",
                openUpwards ? "bottom-full mb-2" : "top-full mt-1.5",
                alignRight ? "right-0" : "left-0"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  {currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="p-1 rounded-lg border border-solid border-white/5 bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer text-muted-foreground hover:text-white"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="p-1 rounded-lg border border-solid border-white/5 bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer text-muted-foreground hover:text-white"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                {daysOfWeek.map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, idx) => {
                  const cellDateStr = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, "0")}-${String(cell.date.getDate()).padStart(2, "0")}`;
                  const isSelected = cellDateStr === selectedDateStr;
                  const isToday = cellDateStr === new Date().toISOString().substring(0, 10);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDate(cell.date)}
                      className={cn(
                        "h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer relative",
                        cell.isCurrentMonth
                          ? isSelected
                            ? "bg-primary text-primary-foreground font-black shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                            : "text-zinc-200 hover:bg-white/5"
                          : "text-zinc-600 hover:bg-white/5",
                        isToday && !isSelected && "border border-solid border-primary/30"
                      )}
                    >
                      <span>{cell.date.getDate()}</span>
                      {isToday && !isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error && <span className="text-xs text-rose-500 block">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
