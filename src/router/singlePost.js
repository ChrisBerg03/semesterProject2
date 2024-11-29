import { singleListing } from "../api/constants";
const postId = sessionStorage.getItem("postId");
const container = document.getElementById("container");

async function getData() {
    try {
        const response = await fetch(singleListing + postId);
        const data = await response.json();
        return data.data;
    } catch (error) {
        alert("There was an error fetching posts. Please try again later.");
        return null;
    }
}

async function displayPost() {
    const post = await getData();
    if (!post) return;

    container.innerHTML = `
        <div class="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white">
            <h2 class="text-2xl font-bold mb-2">${post.title}</h2>
            <p class="text-gray-700 mb-4">${post.description}</p>
            <div class="flex space-x-4 mb-4">
                ${post.media
                    .map(
                        (media) =>
                            `<img src="${media.url}" alt="${media.alt}" class="w-24 h-24 object-cover rounded cursor-pointer" onclick="openModal('${media.url}')">`
                    )
                    .join("")}
            </div>
            <p class="text-gray-600 mb-2">Tags: ${post.tags.join(", ")}</p>
            <p class="text-gray-600 mb-2">Created: ${new Date(
                post.created
            ).toLocaleString()}</p>
            <p class="text-gray-600 mb-2">Updated: ${new Date(
                post.updated
            ).toLocaleString()}</p>
            <p class="text-gray-600 mb-2">Ends At: ${new Date(
                post.endsAt
            ).toLocaleString()}</p>
            <p class="text-gray-600">Bids: ${post._count.bids}</p>
        </div>
    `;
}

displayPost();

// Modal functionality
function openModal(imageUrl) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    modalImage.src = imageUrl;
    modal.classList.remove("hidden");
}

// Attach openModal to the window object
window.openModal = openModal;

document.getElementById("closeModal").addEventListener("click", () => {
    const modal = document.getElementById("imageModal");
    modal.classList.add("hidden");
});

// Close modal when clicking outside the image
document.getElementById("imageModal").addEventListener("click", (event) => {
    if (event.target === document.getElementById("imageModal")) {
        const modal = document.getElementById("imageModal");
        modal.classList.add("hidden");
    }
});
