
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

export default function RideMessages({ rideId, recipientId }: { rideId: number; recipientId: number }) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: messages = [], refetch } = useQuery<Message[]>({
    queryKey: [`/api/rides/${rideId}/messages`],
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/rides/${rideId}/messages`, {
        content: message,
        recipientId,
        rideId,
      });
      setMessage("");
      await refetch();
    },
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-muted p-2 rounded">
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={() => sendMessage.mutate()}>Send</Button>
      </div>
    </div>
  );
}
