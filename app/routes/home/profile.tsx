import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FormField } from "~/components/form-field";
import { ImageUploader } from "~/components/image-uploader";
import { Modal } from "~/components/modal";
import { getUser, requireUserId } from "~/utils/auth.server";
import { updateUser } from "~/utils/user.server";
import { validateName } from "~/utils/validators.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (typeof firstName !== "string" || typeof lastName !== "string") {
    return json({ error: `Invalid Form Data` }, { status: 400 });
  }

  const errors = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
  };

  if (Object.values(errors).some(Boolean)) return json({ errors, fields: { firstName, lastName } }, { status: 400 });

  await updateUser({
    id: userId,
    firstName: firstName,
    lastName: lastName,
  });
  return redirect("/home");
};
export default function ProfileSettings() {
  const { user } = useLoaderData();

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName,
    lastName: user?.profile?.lastName,
    profilePicture: user?.profile?.profilePicture || "",
  });

  const handleFileUpload = async (file: File) => {
    let inputFormData = new FormData();

    inputFormData.append("profile-pic", file);

    const response = await fetch("/avatar", {
      method: "POST",

      body: inputFormData,
    });

    const { imageUrl } = await response.json();

    setFormData({
      ...formData,

      profilePicture: imageUrl,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Modal isOpen={true} className="w-1/3">
      <div className="p-3">
        <h2 className="text-4xl font-semibold text-sky-600 text-center mb-4">Your Profile</h2>
        <div className="flex justify-center items-center">
          <div className="w-1/3">
            <ImageUploader onChange={handleFileUpload} imageUrl={formData.profilePicture || user.profilePicture} />
          </div>
          <div className="flex-1">
            <form method="post" className="flex justify-center flex-col">
              <FormField htmlFor="firstName" label="First Name" value={formData.firstName || user.firstName} onChange={(e) => handleInputChange(e, "firstName")} />
              <FormField htmlFor="lastName" label="Last Name" value={formData.lastName || user.lastName} onChange={(e) => handleInputChange(e, "lastName")} />
              <div className="w-full text-right mt-4">
                <button className="rounded-sm bg-sky-300 font-semibold text-blue-600 px-16 py-2 transition duration-300 ease-in-out hover:bg-sky-400 hover:-translate-y-1">Save</button>
              </div>
            </form>
          </div>
        </div>
        <form action="/logout" method="POST" className="w-full flex justify-end my-2">
          <button type="submit" className="rounded-sm bg-sky-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-sky-400 hover:-translate-y-1">
            Sign Out
          </button>
        </form>
      </div>
    </Modal>
  );
}
