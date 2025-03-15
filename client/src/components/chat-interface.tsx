
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";

export default function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div className="bg-white p-4 rounded-lg shadow-lg w-80">
          <div className="h-60 overflow-y-auto mb-4 bg-gray-50 p-2 rounded">
            {/* Messages will go here */}
          </div>
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button size="sm">Send</Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
