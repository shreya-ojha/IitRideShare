import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RideCard } from "@/components/rides/ride-card";
import { type Ride } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function SearchRides() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const { toast } = useToast();

  const { data: rides, isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides", source, destination],
    enabled: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch due to the queryKey including search params
  };

  const handleJoinRequest = (rideId: number) => {
    toast({
      title: "Join Request",
      description: "Feature coming soon!",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Rides</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="From (e.g. IITI Main Gate)"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="To (e.g. Indore Airport)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4">
            Search Rides
          </Button>
        </form>

        {isLoading ? (
          <div>Loading rides...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rides?.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onJoinRequest={() => handleJoinRequest(ride.id)}
              />
            ))}
            {rides?.length === 0 && (
              <div className="col-span-2 text-center py-8">
                No rides found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
