import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RideCard from "@/components/ride-card";
import type { Ride, User } from "@shared/schema";

export default function Profile() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: userRides = [], isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/user/rides"],
  });

  const activeRides = userRides.filter((ride) => ride.status === "active");
  const pastRides = userRides.filter((ride) => ride.status !== "active");

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Full Name:</span>{" "}
              {user?.fullName}
            </p>
            <p>
              <span className="font-medium">Username:</span>{" "}
              {user?.username}
            </p>
            <p>
              <span className="font-medium">Student ID:</span>{" "}
              {user?.studentId}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Active Rides</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-muted animate-pulse"
              ></div>
            ))}
          </div>
        ) : activeRides.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {activeRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} showActions={false} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No active rides</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Rides</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-muted animate-pulse"
              ></div>
            ))}
          </div>
        ) : pastRides.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {pastRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} showActions={false} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No past rides</p>
        )}
      </div>
    </div>
  );
}
