import Link from "next/link";

export default function Home() {
  return (
    <div>
      想看 chatbot demo 請往這邊走（如果你沒有 userKey 就算了＾＾）：
      <Link href="/chat" className="text-cyan-500">
        chatbot demo
      </Link>
    </div>
  );
}
