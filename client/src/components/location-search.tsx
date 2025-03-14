
import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Card } from "@/components/ui/card";
import { locations } from "@/lib/locations";
import { MapPin } from "lucide-react";

interface LocationSearchProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSelect?: (location: { name: string; area: string; address: string }) => void;
}

export default function LocationSearch({ value, placeholder, onChange, onSelect }: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const [filtered, setFiltered] = useState(locations);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filteredLocations = locations.filter(
      location => 
        location.name.toLowerCase().includes(searchLower) ||
        location.area.toLowerCase().includes(searchLower) ||
        location.address.toLowerCase().includes(searchLower)
    );
    setFiltered(filteredLocations);
  }, [search]);

  return (
    <div className="relative">
      <Card>
        <Command>
          <Command.Input 
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              onChange?.(value);
            }}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
          />
          {open && (
            <Command.List>
              {filtered.length === 0 && (
                <Command.Empty>No locations found</Command.Empty>
              )}
              {filtered.map((location) => (
                <Command.Item
                  key={location.id}
                  value={location.name}
                  onSelect={() => {
                    setSearch(location.name);
                    onChange?.(location.name);
                    onSelect?.(location);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5"
                >
                  <MapPin className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">{location.name}</p>
                    <p className="text-xs text-muted-foreground">{location.area}</p>
                  </div>
                </Command.Item>
              ))}
            </Command.List>
          )}
        </Command>
      </Card>
    </div>
  );
}
