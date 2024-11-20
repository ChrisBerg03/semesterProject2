import { allListings } from "../api/constants";

async function getData() {
    try {
        const response = await fetch(allListings);
        const data = await response.json();
        return data.data;
    } catch (error) {
        alert("There was an error fetching posts. Please try again later.");
        return [];
    }
}

async function displayData() {
    const posts = await getData();
    console.log(posts);
    const container = document.getElementById("postsContainer");

    if (!posts || posts.length === 0) {
        container.innerHTML = "<p>No posts available at the moment.</p>";
        return;
    }

    posts.forEach((post) => {
        const media = post.media[0];
        const postImg =
            media && media.url
                ? `<img class="w-full h-48 object-cover rounded-t-lg" src="${
                      media.url
                  }" alt="${media.alt || "Post image"}">`
                : "";

        function formatTimestamp(timestamp) {
            const date = new Date(timestamp);

            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();

            return `${hours}:${minutes}, ${day}-${month}-${year}`;
        }

        container.innerHTML += `
 <div class="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            ${postImg}
            <div class="p-4">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${
                    post.title
                }</h2>
                <p class="text-gray-600 mb-4">${post.description}</p>
                <p class="text-gray-700 font-medium mb-2">Bids: <span class="font-semibold">${
                    post._count.bids
                }</span></p>
                <p class="text-gray-500 text-sm mb-1">Started at: <span class="font-medium">${formatTimestamp(
                    post.created
                )}</span></p>
                <p class="text-gray-500 text-sm mb-4">Ends at: <span class="font-medium">${formatTimestamp(
                    post.endsAt
                )}</span></p>
                <div class="text-gray-600 text-sm">Tags: <span class="font-semibold">${
                    post.tags.filter((tag) => tag).join(", ") || "No tags"
                }</span></div>
            </div>
        </div>
    `;
    });
}

displayData();
