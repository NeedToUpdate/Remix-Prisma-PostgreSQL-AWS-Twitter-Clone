import { useState } from "react";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";
import { validateEmail, validateName, validatePassword } from "~/utils/validators.server";
import { getUser, login, register } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  console.log(form);
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");
  console.log("action running");
  if (typeof action !== "string" || typeof email !== "string" || typeof password !== "string") {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (action === "register" && (typeof firstName !== "string" || typeof lastName !== "string")) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields: { email, password, firstName, lastName }, form: action }, { status: 400 });
  }
  switch (action) {
    case "login": {
      return await login({ email, password });
    }
    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
};

export default function Login() {
  const actionData = useActionData();
  const [action, setAction] = useState("login");
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formError, setFormError] = useState(actionData?.error || "");

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.lastName || "",
    lastName: actionData?.fields?.firstName || "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Layout>
      <div className="rounded-md shadow-md  flex flex-col gap-2 white">
        <div className="flex">
          <div className="p-5 flex gap-1 flex-col grow-10 w-full">
            <h2 className="text-gray-700 font-bold text-3xl">Login</h2>
            <p className="font-semibold text-slate-600">{action === "login" ? "Log In To Tweet!" : "Sign Up To Get Started!"}</p>
          </div>
          <div className="h-full w-[50%] flex justify-end">
            <button
              onClick={(ev) => {
                setAction(action == "login" ? "register" : "login");
              }}
              className="rounded-m border-2 rounded-sm mt-2 border-emerald-300 px-2 py-1 mr-2 text-emerald-600 font-semibold transition duration-300 ease-in-out  hover:border-emerald-200 hover:-translate-y-[1px]"
            >
              {action === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
        <form method="POST" className="rounded-md bg-slate- p-6 w-96">
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>
          <FormField error={errors?.email} htmlFor="email" label="Email" value={formData.email} onChange={(e) => handleInputChange(e, "email")} />
          <FormField error={errors?.password} htmlFor="password" type="password" label="Password" value={formData.password} onChange={(e) => handleInputChange(e, "password")} />
          {action === "register" && (
            <>
              <FormField error={errors?.firstName} htmlFor="firstName" label="First Name" onChange={(e) => handleInputChange(e, "firstName")} value={formData.firstName} />
              <FormField error={errors?.lastName} htmlFor="lastName" label="Last Name" onChange={(e) => handleInputChange(e, "lastName")} value={formData.lastName} />
            </>
          )}
          <div className="w-full text-center flex gap-2 justify-center">
            <button name="_action" value={action} type="submit" className="rounded-md mt-2 bg-sky-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-sky-200 hover:-translate-y-[1px]">
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
