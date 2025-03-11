interface AiMessageProperty {
  message: string;
}

const AiMessage: React.FC<AiMessageProperty> = ({ message }) => {
  return (
    <div className="w-full p-4">
      <div className="text-white">{message}</div>
    </div>
  );
};

export default AiMessage;
