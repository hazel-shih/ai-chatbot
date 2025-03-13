import { forwardRef } from "react";

interface UserMessageProperty {
  message: string;
}

const UserMessage = forwardRef<HTMLDivElement, UserMessageProperty>(
  ({ message }, ref) => {
    return (
      <div ref={ref} className="p-4 w-full flex justify-end">
        <div className="p-4 w-fit max-w-[50%] bg-neutral-700 text-white flex justify-center items-center rounded-xl">
          {message}
        </div>
      </div>
    );
  }
);

UserMessage.displayName = "UserMessage";

export default UserMessage;
