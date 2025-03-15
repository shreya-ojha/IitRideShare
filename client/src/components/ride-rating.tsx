
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

export default function RideRating({ rideId }: { rideId: number }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { toast } = useToast();

  const submitRating = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/rides/${rideId}/ratings`, {
        rating,
        review,
        rideId,
      });
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`hover:text-yellow-400 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            <Star className="h-6 w-6" />
          </button>
        ))}
      </div>
      <Textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
      />
      <Button onClick={() => submitRating.mutate()}>Submit Rating</Button>
    </div>
  );
}
