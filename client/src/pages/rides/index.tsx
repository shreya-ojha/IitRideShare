import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RideCard from "@/components/ride-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Ride } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function RidesIndex() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: rides = [], isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  const handleRequestJoin = async (rideId: number) => {
    try {
      await apiRequest("POST", `/api/rides/${rideId}/requests`);
      await queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({
        title: "Success",
        description: "Ride request sent successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to request ride",
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const filteredRides = rides.filter(
    (ride) =>
      !search || 
      ride.source.toLowerCase().includes(search.toLowerCase()) ||
      ride.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Available Rides</h1>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search by location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-lg bg-muted animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredRides.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredRides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onRequestJoin={handleRequestJoin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No rides available</p>
        </div>
      )}
    </div>
  );
}
