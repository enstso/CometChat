import Button from "../ui/Button";

export default function SearchUserItem({
  user,
  onCreate,
  disabled,
}: {
  user: { id: string; username: string };
  onCreate: (userId: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
      <span>{user.username}</span>
      <Button size="sm" onClick={() => onCreate(user.id)} disabled={disabled}>
        Créer
      </Button>
    </div>
  );
}
