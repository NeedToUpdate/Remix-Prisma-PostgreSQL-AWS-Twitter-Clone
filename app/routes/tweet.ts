import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { createTweet } from "~/utils/tweet.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  if (!userId) {
    redirect("/login");
  }

  const form = await request.formData();
  const content = form.get("content");
  console.log(content);
  if (typeof content !== "string") {
    return json({ error: "Invalid Form Data" }, { status: 400 });
  }
  if (content === "") {
    return json({ error: "Please Write A Tweet" }, { status: 400 });
  }
  const tweet = createTweet(content, userId);
  return json({ tweet }, { status: 200 });
};

export const loader: LoaderFunction = async () => redirect("/home");
