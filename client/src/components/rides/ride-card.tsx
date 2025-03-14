import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Ride } from "@shared/schema";
import { format } from "date-fns";

interface RideCardProps {
  ride: Ride;
  onJoinRequest?: () => void;
  showActions?: boolean;
}

export function RideCard({ ride, onJoinRequest, showActions = true }: RideCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{ride.source}</h3>
          <p className="text-sm text-muted-foreground">to</p>
          <h3 className="text-lg font-semibold">{ride.destination}</h3>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">₹{ride.costPerSeat}</p>
          <p className="text-sm text-muted-foreground">per seat</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Departure</span>
            <span className="font-medium">
              {format(new Date(ride.departureTime), "PPp")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Available Seats</span>
            <span className="font-medium">{ride.availableSeats}</span>
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={onJoinRequest}
            disabled={ride.availableSeats === 0}
          >
            {ride.availableSeats === 0 ? "Full" : "Request to Join"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
