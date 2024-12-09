import { navHeader } from "./header";
import { allListings } from "../api/constants";
import { loggedIn } from "../api/headers";

navHeader();

document.getElementById("profileImg").src =
    localStorage.getItem("avatar") ||
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

document.getElementById("addMediaField").addEventListener("click", () => {
    const mediaFields = document.getElementById("mediaFields");
    const newMediaInput = document.createElement("div");
    newMediaInput.className = "media-input mb-2";
    newMediaInput.innerHTML = `
            <input
                type="url"
                placeholder="Media URL"
                class="w-full px-3 py-2 mb-1 border border-gray-300 rounded-lg"
            />
            <input
                type="text"
                placeholder="Media Alt Text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
        `;
    mediaFields.appendChild(newMediaInput);
});

document
    .getElementById("createPostForm")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const tags = document.getElementById("tags").value
            ? document
                  .getElementById("tags")
                  .value.split(",")
                  .map((tag) => tag.trim())
            : [];
        const endsAt = document.getElementById("endsAt").value;

        if (!title || !endsAt) {
            alert("Title and Ends At are required!");
            return;
        }

        // Gather media entries
        const mediaElements = document.querySelectorAll(
            "#mediaFields .media-input"
        );
        const media = Array.from(mediaElements)
            .map((element) => {
                const url = element.querySelector("input[type='url']").value;
                const alt = element.querySelector("input[type='text']").value;
                return url ? { url, alt: alt || "" } : null;
            })
            .filter(Boolean);

        const requestBody = JSON.stringify({
            title,
            description: description || undefined,
            tags: tags.length > 0 ? tags : undefined,
            media: media.length > 0 ? media : undefined,
            endsAt: new Date(endsAt).toISOString(),
        });

        const myHeaders = await loggedIn();

        try {
            const response = await fetch(`${allListings}`, {
                method: "POST",
                headers: myHeaders,
                body: requestBody,
            });

            if (response.ok) {
                const data = await response.json();
                alert("Post created successfully!");
                window.location.href = "/";
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                alert("Failed to create post. See console for details.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred.");
        }
    });
