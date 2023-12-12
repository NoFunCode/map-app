"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type MonthPickerProps = {
  months: string[];
  onMonthChange: (monthNumber: number) => void;
  selectedMonth: string; // Added prop for the selected month
};

const MonthPicker: React.FC<MonthPickerProps> = ({
  months,
  onMonthChange,
  selectedMonth, // Receive the selectedMonth prop
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedMonth || ""); // Set the initial value

  const onSelectMonth = (month: string, index: number) => {
    setValue(month); // Update the value state
    onMonthChange(index + 1); // Call the handler with the selected month
    setOpen(false); // Close the popover
  };

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Pick a month:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value || "Select a month:"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search month..." />
            <CommandEmpty>No matching month found.</CommandEmpty>
            <CommandGroup>
              {months.map((month, index) => (
                <CommandItem
                  key={index}
                  value={month}
                  onSelect={() => onSelectMonth(month, index)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === month ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {month}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthPicker;
