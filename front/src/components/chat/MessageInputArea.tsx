import Input from "../ui/Input";
import Button from "../ui/Button";

type Props = {
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  disabled: boolean;
};

function MessageInputArea({ messageText, setMessageText, onSendMessage, disabled }: Props) {
  return (
    <div className="p-4 border-t flex gap-2 bg-gray-50">
      <Input
        className="flex-1"
        placeholder="Write a message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
          }
        }}
        disabled={disabled}
        aria-label="Message input"
        rows={1}
      />
      <Button onClick={onSendMessage} disabled={disabled || !messageText.trim()} aria-label="Send message">
        Send
      </Button>
    </div>
  );
}
export default MessageInputArea;