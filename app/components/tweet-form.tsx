import type { User } from "@prisma/client";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setFormData({
      content: "",
    });
  }, [fetcher]);
  return (
    <div className="w-full h-fit bg-slate-300 p-3">
      <div className="flex gap-2 justify-around items-center flex-wrap-reverse">
        <fetcher.Form method="post" action="/tweet" className="flex gap-2 justify-around items-center">
          <textarea
            value={formData.content}
            onChange={(e) => handleChange(e, "content")}
            className="rounded-md resize-none p-2 max-w-[600px] w-full"
            name="content"
            id="content"
            cols={60}
            rows={2}
            placeholder="Tweet your thoughts!"
          ></textarea>
          <button type="submit" className="rounded-sm bg-sky-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-sky-400 hover:-translate-y-1">
            Tweet
          </button>
        </fetcher.Form>
        <UserCircle className="h-20 w-20 transition duration-300 ease-in-out hover:scale-110 border-2 border-sky-300 hover:border-white" user={user} onClick={() => navigate("profile")} />
      </div>
      {fetcher.data?.error ? <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">{fetcher.data?.error}</div> : <></>}
    </div>
  );
}
