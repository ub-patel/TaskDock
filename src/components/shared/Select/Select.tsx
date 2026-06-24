import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  containerClassName?: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, label, id, containerClassName, value, defaultValue, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const [alignRight, setAlignRight] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    const options: DropdownOption[] = React.Children.toArray(children)
      .map((child) => {
        if (React.isValidElement(child) && child.type === "option") {
          const optionChild = child as React.ReactElement<any>;
          return {
            value: optionChild.props.value as string,
            label: optionChild.props.children as string,
          };
        }
        return null;
      })
      .filter((opt): opt is DropdownOption => opt !== null);

    const [selectedValue, setSelectedValue] = useState<string>(() => {
      if (value !== undefined) return value as string;
      if (defaultValue !== undefined) return defaultValue as string;
      return options[0]?.value || "";
    });

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value as string);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      const updatePosition = () => {
        if (isOpen && triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const popoverHeight = 240;
          if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
            setOpenUpwards(true);
          } else {
            setOpenUpwards(false);
          }

          const spaceRight = window.innerWidth - rect.left;
          const popoverWidth = 200;
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

    const handleSelectOption = (optValue: string) => {
      setSelectedValue(optValue);
      setIsOpen(false);

      if (hiddenSelectRef.current) {
        const nativeSelect = hiddenSelectRef.current;
        nativeSelect.value = optValue;

        const event = new Event("change", { bubbles: true });
        Object.defineProperty(event, "target", {
          writable: true,
          value: nativeSelect,
        });

        nativeSelect.dispatchEvent(event);
        if (onChange) {
          onChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
        }
      }
    };

    const selectedOption = options.find((opt) => opt.value === selectedValue) || options[0];

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
            <span className="truncate min-w-0 flex-1 mr-2">{selectedOption?.label || ""}</span>
            <ChevronDown
              className={cn("text-muted-foreground transition duration-200 shrink-0", isOpen && "rotate-180")}
              size={16}
            />
          </button>

          <select
            id={id}
            ref={(node) => {
              hiddenSelectRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            value={selectedValue}
            onChange={() => {}}
            className="sr-only"
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {isOpen && options.length > 0 && (
            <div
              className={cn(
                "absolute bg-zinc-950/95 border border-white/5 shadow-2xl rounded-xl py-1.5 z-[9999] backdrop-blur-xl animate-fade-in max-h-60 overflow-y-auto min-w-full",
                openUpwards ? "bottom-full mb-1.5" : "top-full mt-1.5",
                alignRight ? "right-0" : "left-0"
              )}
            >
              {options.map((opt) => {
                const isSelected = opt.value === selectedValue;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm flex items-center justify-between transition cursor-pointer font-medium hover:bg-white/5",
                      isSelected ? "text-primary bg-primary/5" : "text-zinc-300 hover:text-white"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check size={14} className="text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && <span className="text-xs text-rose-500 block">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
