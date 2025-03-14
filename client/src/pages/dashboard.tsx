import { useQuery } from "@tanstack/react-query";
import { RideCard } from "@/components/rides/ride-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Ride } from "@shared/schema";

export default function Dashboard() {
  const { data: rides, isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rides?.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
