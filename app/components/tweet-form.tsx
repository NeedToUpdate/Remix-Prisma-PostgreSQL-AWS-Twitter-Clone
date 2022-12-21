import type { User } from "@prisma/client";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { UserCircle } from "./user-circle";

interface props {
  user: User;
}

export default function TweetForm({ user }: props) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setFormData((data) => ({ ...data, [field]: e.target.value }));
  };

  return (
    <div className="w-full h-fit bg-slate-300 p-3">
      <fetcher.Form method="post" action="/tweet">
        <div className="flex gap-2 justify-around items-center">
          <textarea value={formData.content} onChange={(e) => handleChange(e, "content")} className="rounded-md resize-none p-2" name="content" id="content" cols={60} rows={2} placeholder="Tweet your thoughts!"></textarea>
          <button type="submit" className="rounded-sm bg-sky-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-sky-400 hover:-translate-y-1">
            Tweet
          </button>
          <UserCircle className="h-14 w-14 transition duration-300 ease-in-out hover:scale-110 hover:border-2 hover:border-yellow-300" user={user} onClick={() => navigate("profile")} />
        </div>
        {fetcher.data?.error ? <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">{fetcher.data?.error}</div> : <></>}
      </fetcher.Form>
    </div>
  );
}
