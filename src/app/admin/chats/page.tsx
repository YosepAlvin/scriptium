import ChatDashboard from "./ChatDashboard";
import { getAdminChatList } from "@/lib/actions/chat";

export const metadata = {
  title: "Chat Management | Admin",
};

export default async function AdminChatsPage() {
  const chatList = await getAdminChatList();

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-playfair text-3xl font-bold mb-2">Chat Management</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
            Kelola pesan dari pelanggan
          </p>
        </div>
      </div>

      <ChatDashboard initialChatList={chatList} />
    </div>
  );
}
