import type { SearchBarType } from "../../types/ui/searchBar";
import Button from "./Button";
import Input from "./Input";
import { useState } from "react";

export default function SearchBar({ user, onCreate, disabled }: SearchBarType) {
  const [title, setTitle] = useState<string | null>("");

  return (
    <div className="flex items-center bg-gray-100 p-2 rounded-md space-x-3">
      <span className="font-medium text-gray-800 whitespace-nowrap">
        {user.username}
      </span>
      <Input
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
        className="flex-1 min-w-0"
      />
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
