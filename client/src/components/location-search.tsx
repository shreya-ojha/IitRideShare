import { Card } from "@/components/ui/card";
import { Command } from "cmdk";
import { useState } from "react";

interface LocationSearchProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function LocationSearch({ value, placeholder, onChange }: LocationSearchProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Card>
        <Command shouldFilter={false}>
          <Command.Input 
            value={value} 
            onValueChange={onChange}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
          {open && (
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
            </Command.List>
          )}
        </Command>
      </Card>
    </div>
  );
}