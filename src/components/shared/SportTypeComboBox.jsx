import React, { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const sports = [
  { value: "Basketball", label: "Basketball" },
  { value: "Football", label: "Football" },
  { value: "Swimming", label: "Swimming" },
  { value: "Hockey", label: "Hockey" },
  { value: "Baseball", label: "Baseball" },
  { value: "Wrestling", label: "Wrestling" },
  { value: "Soccer", label: "Soccer" },
  { value: "Volleyball", label: "Volleyball" },
  { value: "Tennis", label: "Tennis" },
  { value: "Track & Field", label: "Track & Field" },
  { value: "Golf", label: "Golf" },
  { value: "Softball", label: "Softball" },
];

export default function SportTypeComboBox({ value, onValueChange, placeholder = "Select sport..." }) {
  const [open, setOpen] = useState(false);

  const selectedSport = sports.find((sport) => sport.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSport ? selectedSport.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search sports..." className="h-9" />
          <CommandList>
            <CommandEmpty>No sport found.</CommandEmpty>
            <CommandGroup>
              {sports.map((sport) => (
                <CommandItem
                  key={sport.value}
                  value={sport.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === sport.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {sport.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}