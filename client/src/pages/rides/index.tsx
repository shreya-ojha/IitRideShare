
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import type { Ride, RideRequest } from "@shared/schema";

export default function RidesIndex() {
  const { toast } = useToast();
  
  const { data: rides = [] } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: requests = [] } = useQuery<RideRequest[]>({
    queryKey: ["/api/rides/requests"],
    enabled: !!user,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, rideId, status }: { requestId: number, rideId: number, status: string }) => {
      return apiRequest("POST", `/api/rides/${rideId}/requests/${requestId}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Request updated",
        description: "The ride request has been updated.",
      });
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Available Rides</h1>
      
      {user && rides.some(ride => ride.creatorId === user.id) && (
        <div className="bg-muted p-4 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Pending Requests</h2>
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between bg-background p-4 rounded-lg">
              <div>
                <p>From: {request.user?.username}</p>
                <p className="text-sm text-muted-foreground">Student ID: {request.user?.studentId}</p>
              </div>
              <div className="space-x-2">
                <Button 
                  variant="default"
                  onClick={() => updateRequestMutation.mutate({ 
                    requestId: request.id, 
                    rideId: request.rideId,
                    status: 'accepted' 
                  })}
                >
                  Accept
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => updateRequestMutation.mutate({ 
                    requestId: request.id,
                    rideId: request.rideId, 
                    status: 'rejected' 
                  })}
                >
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {rides.map((ride) => (
          <div key={ride.id} className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold">{ride.source} → {ride.destination}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(ride.departureDate).toLocaleString()}
            </p>
            <p>Available seats: {ride.availableSeats}</p>
            <p>Cost per seat: ₹{ride.costPerSeat}</p>
            {user && user.id !== ride.creatorId && (
              <Button 
                className="mt-2"
                onClick={async () => {
                  try {
                    await apiRequest("POST", `/api/rides/${ride.id}/requests`);
                    toast({
                      title: "Request sent",
                      description: "Your request has been sent to the ride creator.",
                    });
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: error instanceof Error ? error.message : "Failed to send request",
                    });
                  }
                }}
              >
                Request Seat
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
