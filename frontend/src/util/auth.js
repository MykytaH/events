import { redirect } from "react-router-dom";

// getting token from localStorage

export default function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  if (getTokenDuration() < 0) {
    return "EXPIRED";
  }
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

// loader for redirecting users from pages that shouldn't be available without token

export function checkAuth() {
  const token = getAuthToken();

  if (!token || token === "EXPIRED") {
    return redirect("/auth");
  }
  return null;
}

// checking expiration of a token

export function getTokenDuration() {
  const expirationDate = new Date(localStorage.getItem("expiration"));
  const currentDate = new Date();

  const duration = expirationDate.getTime() - currentDate.getTime();

  return duration;
}
