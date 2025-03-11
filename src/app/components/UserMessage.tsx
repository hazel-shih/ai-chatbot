interface UserMessageProperty {
  message: string;
}

const UserMessage: React.FC<UserMessageProperty> = ({ message }) => {
  return (
    <div className="p-4 w-full flex justify-end">
      <div className="p-4 w-fit max-w-[50%] bg-neutral-700 text-white flex justify-center items-center rounded-xl">
        {message}
      </div>
    </div>
  );
};

export default UserMessage;
