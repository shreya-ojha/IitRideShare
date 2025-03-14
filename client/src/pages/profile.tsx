import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Booking, type Ride } from "@shared/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export default function Profile() {
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/me"],
  });

  const { data: createdRides, isLoading: isLoadingRides } = useQuery<Ride[]>({
    queryKey: ["/api/rides/created"],
  });

  const bookingColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "rideId",
      header: "Ride ID",
    },
    {
      accessorKey: "requestedSeats",
      header: "Seats",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`capitalize ${row.original.status === "pending" ? "text-yellow-600" : "text-green-600"}`}>
          {row.original.status}
        </span>
      ),
    },
  ];

  const rideColumns: ColumnDef<Ride>[] = [
    {
      accessorKey: "source",
      header: "From",
    },
    {
      accessorKey: "destination",
      header: "To",
    },
    {
      accessorKey: "departureTime",
      header: "Departure",
      cell: ({ row }) => format(new Date(row.original.departureTime), "PPp"),
    },
    {
      accessorKey: "availableSeats",
      header: "Available Seats",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`capitalize ${row.original.status === "active" ? "text-green-600" : "text-gray-600"}`}>
          {row.original.status}
        </span>
      ),
    },
  ];

  if (isLoadingBookings || isLoadingRides) {
    return <div>Loading profile data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>My Ride Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={bookingColumns}
              data={bookings || []}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Created Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={rideColumns}
              data={createdRides || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
