import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import type { Ride } from "@shared/schema";
import RideRequests from "./ride-requests";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface RideCardProps {
  ride: Ride;
  onRequestJoin?: (rideId: number) => void;
  handleRequestAction?: (rideId: number, action: 'accepted' | 'rejected') => void;
  showActions?: boolean;
}

export default function RideCard({ ride, onRequestJoin, handleRequestAction, showActions = true }: RideCardProps) {
  // Get current user to check if they're the ride creator
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const isCreator = currentUser?.id === ride.creatorId;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{ride.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{ride.destination}</span>
            </div>
          </div>

          <Badge variant={ride.status === "active" ? "default" : "secondary"}>
            {ride.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(ride.departureDate), "MMM d, h:mm a")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{ride.availableSeats} seats left</span>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <span>₹{ride.costPerSeat} per seat</span>
          </div>
        </div>

        {isCreator && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Ride Requests</h3>
            <RideRequests rideId={ride.id} />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {showActions && onRequestJoin && (
          <Button
            variant="default"
            onClick={onRequestJoin}
            className="w-full"
          >
            Request Ride
          </Button>
        )}
        {ride.status === "pending_requests" && handleRequestAction && (
          <div className="space-x-2">
            <Button variant="default" onClick={() => handleRequestAction(ride.id, 'accepted')}>
              Accept
            </Button>
            <Button variant="destructive" onClick={() => handleRequestAction(ride.id, 'rejected')}>
              Decline
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}