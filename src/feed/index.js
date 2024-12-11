import { allListings } from "../api/constants";
import { navHeader } from "../ui/header";
import { loggedIn } from "../api/headers";

navHeader();

let pageCount = 1;
const postsPerPage = 20;

async function getData(page) {
    try {
        const response = await fetch(
            `${allListings}?_bids=true&_active=true&limit=${postsPerPage}&page=${page}`
        );
        const data = await response.json();
        return data.data;
    } catch (error) {
        alert("There was an error fetching posts. Please try again later.");
        return [];
    }
}

async function displayData(page = 1) {
    const posts = await getData(page);
    const container = document.getElementById("postsContainer");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

    if (!posts || posts.length === 0) {
        container.innerHTML = "<p>No posts available at the moment.</p>";
        nextPageBtn.disabled = true;
        return;
    }

    container.innerHTML = "";

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

        let highestBidInfo = `<p class="text-gray-700">No bids yet.</p>`;
        if (post.bids.length > 0) {
            const highestBid = post.bids.reduce(
                (max, bid) => (bid.amount > max.amount ? bid : max),
                post.bids[0]
            );
            highestBidInfo = `
                <p class="text-gray-700 font-medium mb-2">
                    Highest Bidder: <span class="font-semibold">${highestBid.bidder.name}</span>
                </p>
                <p class="text-gray-700 font-medium mb-2">
                    Current bid: <span class="font-semibold">${highestBid.amount}kr</span>
                </p>
            `;
        }

        container.innerHTML += `
            <div class="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden cursor-pointer" data-id="${
                post.id
            }">
                ${postImg}
                <div class="p-4">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">${
                        post.title
                    }</h2>
                    <p class="text-gray-600 mb-4">${post.description}</p>
                    <p class="text-gray-700 font-medium mb-2">Bids: <span class="font-semibold">${
                        post._count.bids
                    }</span><br/></p>
                    ${highestBidInfo}
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

    document.querySelectorAll("[data-id]").forEach((postElement) => {
        postElement.addEventListener("click", function () {
            const postId = this.getAttribute("data-id");
            sessionStorage.setItem("postId", postId);
            window.location.href = "post/";
        });
    });

    prevPageBtn.disabled = page <= 1;
    nextPageBtn.disabled = posts.length < postsPerPage;
}

document.getElementById("prevPageBtn").addEventListener("click", () => {
    if (pageCount > 1) {
        pageCount--;
        displayData(pageCount);
        window.scrollTo(0, 0);
    }
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
    pageCount++;
    displayData(pageCount);
    window.scrollTo(0, 0);
});

document.querySelectorAll(".submitSearchBtn").forEach((button) => {
    button.addEventListener("click", async (event) => {
        event.preventDefault();

        const form = button.closest("form");
        const searchInput = form.querySelector(".searchInput").value;

        if (!searchInput.trim()) {
            alert("Please enter a search term.");
            return;
        }

        const myHeaders = await loggedIn();

        try {
            const response = await fetch(
                `https://v2.api.noroff.dev/social/posts/search?q=${encodeURIComponent(
                    searchInput
                )}`,
                {
                    method: "GET",
                    headers: myHeaders,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            displaySearchResults(data.data);
        } catch (error) {
            alert("There was an error fetching posts. Please try again later.");
            console.error(error);
        }
    });
});

function displaySearchResults(posts) {
    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    if (!posts || posts.length === 0) {
        container.innerHTML = "<p>No posts match your search criteria.</p>";
        return;
    }

    posts.forEach((post) => {
        const media =
            Array.isArray(post.media) && post.media.length > 0
                ? post.media[0]
                : null;
        const postImg =
            media && media.url
                ? `<img class="w-full h-48 object-cover rounded-t-lg" src="${
                      media.url
                  }" alt="${media.alt || "Post image"}">`
                : "";

        const formatTimestamp = (timestamp) => {
            const date = new Date(timestamp);
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();

            return `${hours}:${minutes}, ${day}-${month}-${year}`;
        };

        let highestBidInfo = `<p class="text-gray-700">No bids yet.</p>`;
        if (post.bids && post.bids.length > 0) {
            const highestBid = post.bids.reduce(
                (max, bid) => (bid.amount > max.amount ? bid : max),
                post.bids[0]
            );
            highestBidInfo = `
                <p class="text-gray-700 font-medium mb-2">
                    Highest Bidder: <span class="font-semibold">${highestBid.bidder.name}</span>
                </p>
                <p class="text-gray-700 font-medium mb-2">
                    Current bid: <span class="font-semibold">${highestBid.amount}kr</span>
                </p>
            `;
        }

        container.innerHTML += `
            <div class="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden cursor-pointer" data-id="${
                post.id
            }">
                ${postImg}
                <div class="p-4">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">${
                        post.title
                    }</h2>
                    <p class="text-gray-600 mb-4">${post.description}</p>
                    <p class="text-gray-700 font-medium mb-2">Bids: <span class="font-semibold">${
                        post._count.bids
                    }</span><br/></p>
                    ${highestBidInfo}
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

    document.querySelectorAll("[data-id]").forEach((postElement) => {
        postElement.addEventListener("click", function () {
            const postId = this.getAttribute("data-id");
            sessionStorage.setItem("postId", postId);
            window.location.href = "post/";
        });
    });
}

displayData(pageCount);
