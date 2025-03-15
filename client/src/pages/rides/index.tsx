import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat-interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RideCard from "@/components/ride-card";
import { Plus, Car, Clock } from "lucide-react";
import { useLocation, useNavigate } from "wouter"; // Changed import
import type { Ride, RideRequest } from "@shared/schema";

export default function RidesIndex() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation(); // Changed to wouter's hook

  const { data: rides = [], refetch: refetchRides } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: requests = [], refetch: refetchRequests } = useQuery<RideRequest[]>({
    queryKey: ["/api/rides/requests"],
    enabled: !!user,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, rideId, status }: { requestId: number, rideId: number, status: string }) => {
      await apiRequest("POST", `/api/rides/${rideId}/requests/${requestId}`, { status });
      await refetchRequests();
      await refetchRides();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
    },
  });

  const handleRequestRide = async (rideId: number) => {
    try {
      await apiRequest("POST", `/api/rides/${rideId}/requests`, {});
      await refetchRides();
      toast({
        title: "Success",
        description: "Ride request sent successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to request ride",
      });
    }
  };

  const myRides = rides.filter(ride => ride.creatorId === user?.id);
  const availableRides = rides.filter(ride => ride.creatorId !== user?.id && ride.availableSeats > 0);

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">IIT Indore Rides</h1>
        <Button onClick={() => setLocation("/rides/create")} className="gap-2"> {/* Changed to wouter's hook */}
          <Plus className="h-4 w-4" /> Create Ride
        </Button>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available" className="gap-2">
            <Car className="h-4 w-4" /> Available Rides
          </TabsTrigger>
          <TabsTrigger value="my-rides" className="gap-2">
            <Clock className="h-4 w-4" /> My Rides & Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onRequestJoin={() => handleRequestRide(ride.id)}
              />
            ))}
            {availableRides.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No available rides at the moment
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-rides">
          <div className="space-y-8">
            {requests.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Pending Requests</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {requests.map((request) => (
                    <div key={request.id} className="bg-card p-4 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{request.user?.username}</p>
                          <p className="text-sm text-muted-foreground">Student ID: {request.user?.studentId}</p>
                        </div>
                        <div className="space-x-2">
                          <Button
                            size="sm"
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
                            size="sm"
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">My Created Rides</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} showActions={false} />
                ))}
                {myRides.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-8">
                    You haven't created any rides yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    <ChatInterface />
  );
}