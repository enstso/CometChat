import type { SearchBarType } from "../../types/ui/searchBar";
import Button from "./Button";
import Input from "./Input";
import { useState } from "react";

export default function SearchBar({ user, onCreate, disabled }: SearchBarType) {
  // State to store the input value for the title, initialized as an empty string
  const [title, setTitle] = useState<string | null>("");

  return (
    // Container with flex layout for aligning username, input, and button horizontally
    <div className="flex items-center bg-gray-100 p-2 rounded-md space-x-3">
      {/* Display the username with styling */}
      <span className="font-medium text-gray-800 whitespace-nowrap">
        {user.username}
      </span>
      {/* Controlled Input component for entering the title */}
      <Input
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
        className="flex-1 min-w-0"
      />
      {/* Button to trigger the creation action with user ID and title */}
      <Button
        onClick={() => onCreate(user.id, title)}
        disabled={disabled}
        className="whitespace-nowrap"
      >
        Create
      </Button>
    </div>
  );
}
