import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface RideRequest {
  id: number;
  rideId: number;
  userId: number;
  status: string;
  user: {
    username: string;
    fullName: string;
    studentId: string;
  } | null;
}

interface RideRequestsProps {
  rideId: number;
}

export default function RideRequests({ rideId }: RideRequestsProps) {
  const { toast } = useToast();
  const { data: requests = [], isLoading } = useQuery<RideRequest[]>({
    queryKey: [`/api/rides/${rideId}/requests`],
  });

  const handleRequestAction = async (requestId: number, status: 'accepted' | 'rejected') => {
    try {
      await apiRequest("POST", `/api/rides/${rideId}/requests/${requestId}`, { status });
      await queryClient.invalidateQueries({ queryKey: [`/api/rides/${rideId}/requests`] });
      await queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({
        title: "Success",
        description: `Request ${status} successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update request",
      });
    }
  };

  if (isLoading) {
    return <div>Loading requests...</div>;
  }

  if (requests.length === 0) {
    return <p className="text-muted-foreground">No requests yet</p>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle className="text-lg">Request from {request.user?.fullName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Student ID: {request.user?.studentId}</p>
            <p className="text-sm font-medium mt-2">Status: {request.status}</p>
          </CardContent>
          {request.status === 'pending' && (
            <CardFooter className="flex gap-2">
              <Button
                onClick={() => handleRequestAction(request.id, 'accepted')}
                size="sm"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleRequestAction(request.id, 'rejected')}
                variant="outline"
                size="sm"
              >
                Reject
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
