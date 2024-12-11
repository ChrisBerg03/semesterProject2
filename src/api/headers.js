import { API_KEY } from "./constants";

export async function loggedIn() {
    const accessToken = localStorage.getItem("accessToken");

    const headers = new Headers();

    if (API_KEY) {
        headers.append("X-Noroff-API-Key", API_KEY);
        headers.append("Content-Type", "application/json");
    }

    if (accessToken) {
        headers.append("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
}
export async function headers() {
    const headers = new Headers();

    if (API_KEY) {
        headers.append("X-Noroff-API-Key", API_KEY);
        headers.append("Content-Type", "application/json");
    }

    return headers;
}
