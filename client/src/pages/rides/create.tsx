import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CreateRideForm } from "@/components/rides/create-ride-form";
import { type InsertRide } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CreateRide() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const createRideMutation = useMutation({
    mutationFn: async (ride: InsertRide) => {
      const res = await apiRequest("POST", "/api/rides", ride);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ride created successfully",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create a New Ride</h1>
        <CreateRideForm
          onSubmit={(data) => createRideMutation.mutate(data)}
          isLoading={createRideMutation.isPending}
        />
      </div>
    </div>
  );
}
