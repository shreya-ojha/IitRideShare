import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import type { Ride } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface RideCardProps {
  ride: Ride;
  onRequestJoin?: () => void;
  showActions?: boolean;
}

export default function RideCard({ ride, onRequestJoin, showActions = true }: RideCardProps) {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const isCreator = user?.id === ride.creatorId;
  const departureDate = new Date(ride.departureDate);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-foreground">{ride.source}</span>
              <span>→</span>
              <span className="font-medium text-foreground">{ride.destination}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={departureDate.toISOString()}>
                {format(departureDate, "PPp")}
              </time>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{ride.availableSeats} seats available</span>
            </div>

            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span>₹{ride.costPerSeat} per seat</span>
            </div>
          </div>
        </div>
      </CardContent>

      {showActions && !isCreator && onRequestJoin && (
        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full"
            variant={ride.availableSeats > 0 ? "default" : "secondary"}
            disabled={ride.availableSeats === 0}
            onClick={onRequestJoin}
          >
            {ride.availableSeats > 0 ? "Request Ride" : "No Seats Available"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}