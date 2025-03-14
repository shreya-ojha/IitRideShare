import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import type { Ride } from "@shared/schema";

interface RideCardProps {
  ride: Ride;
  onRequestJoin?: (rideId: number) => void;
  showActions?: boolean;
}

export default function RideCard({ ride, onRequestJoin, showActions = true }: RideCardProps) {
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
      </CardContent>

      {showActions && (
        <CardFooter className="flex justify-end pt-4">
          <Button
            onClick={() => onRequestJoin?.(ride.id)}
            disabled={ride.availableSeats === 0 || ride.status !== "active"}
          >
            Request to Join
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}