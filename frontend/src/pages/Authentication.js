import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  // action type (login/signup) based on query selector

  const searchParams = new URL(request.url).searchParams;
  let mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    mode = "signup";
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch(`http://localhost:8080/${mode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }
  if (!response.ok) {
    throw json({ messege: "Could not authenticate user." }, { status: 500 });
  }

  // creating token and its expiration date (in 1 hour)

  const resData = await response.json();
  const token = resData.token;

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);

  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expiration.toISOString());

  return redirect("/");
}
