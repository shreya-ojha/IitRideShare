import { useState, useEffect } from "react";
import { Command } from "cmdk";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { locations } from "@/lib/locations";
import { MapPin } from "lucide-react";

interface LocationSearchProps {
  placeholder: string;
  onSelect: (location: { name: string; area: string; address: string }) => void;
}

export default function LocationSearch({ placeholder, onSelect }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(locations);

  useEffect(() => {
    const filtered = locations.filter(location =>
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.area.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [search]);

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md">
        <Command.Input
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsOpen(true)}
          className="h-10"
        />
      </Command>

      {isOpen && filteredLocations.length > 0 && (
        <Card className="absolute mt-1 w-full z-50">
          <CardContent className="p-0">
            <Command.List className="max-h-[300px] overflow-y-auto">
              {filteredLocations.map((location) => (
                <Command.Item
                  key={location.id}
                  onSelect={() => {
                    onSelect(location);
                    setSearch(location.name);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-muted-foreground">{location.area}</p>
                  </div>
                </Command.Item>
              ))}
            </Command.List>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
