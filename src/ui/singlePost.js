import { singleListing } from "../api/constants";
import { navHeader } from "./header";
import { loggedIn } from "../api/headers";
navHeader();

const postId = sessionStorage.getItem("postId");
const container = document.getElementById("container");

async function getData() {
    try {
        const response = await fetch(singleListing + postId + "?_bids=true");
        const data = await response.json();
        return data.data;
    } catch (error) {
        alert("There was an error fetching posts. Please try again later.");
        return null;
    }
}

async function displayPost() {
    const post = await getData();
    if (!post) {
        console.error("Failed to fetch the post data.");
        return;
    }

    const images =
        post.media?.length > 0 ? post.media.map((item) => item.url) : [];
    let currentIndex = 0;

    const defaultImageUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1j2TtW91qg8IzXnJHaD4LoMC52eqO3ImgAQ&s";

    function updateImage() {
        const img = container.querySelector("img");

        if (images.length > 0) {
            img.src = images[currentIndex];
            img.alt =
                post.media[currentIndex]?.alt || `Image ${currentIndex + 1}`;
            document.getElementById("imageCounter").textContent = `Image ${
                currentIndex + 1
            } of ${images.length}`;
        } else {
            img.src = defaultImageUrl;
            img.alt = "Default image";
            document.getElementById("imageCounter").textContent =
                "No images available";
        }
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${hours}:${minutes}, ${day}/${month}/${year}`;
    }

    function createTimer(endTime, element) {
        function updateTimer() {
            const now = new Date().getTime();
            const distance = new Date(endTime).getTime() - now;

            if (distance < 0) {
                element.innerHTML =
                    "<span class='text-red-500 font-medium'>Auction ended</span>";
                clearInterval(timerInterval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
        }

        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    }

    let bidContainer = "";
    if (localStorage.getItem("accessToken")) {
        bidContainer = ` 
        <div class="mt-4">
            <button id="openBidInput" class="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
                Place Bid
            </button>
            <div id="bidInputContainer" class="hidden mt-2">
                <input
                    type="number"
                    id="bidAmount"
                    placeholder="Enter your bid amount"
                    class="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
                <button id="submitBid" class="mt-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200">
                    Submit Bid
                </button>
            </div>
        </div>
    `;
    } else {
        bidContainer = `
        <p class="text-gray-700 font-medium mt-4">
            You must be logged in to place a bid.
        </p>
    `;
    }

    let highestBidInfo = `<p class="text-gray-700">No bids yet.</p>`;
    if (post.bids?.length > 0) {
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

    let allBids = "<p class='text-gray-700'>No bids yet.</p>";
    if (post.bids?.length > 0) {
        allBids = post.bids
            .map(
                (bid) => `
            <p class='text-gray-600'>
                Bidder: <span class='font-semibold'>${bid.bidder.name}</span> - 
                Amount: <span class='font-semibold'>${bid.amount}kr</span>
            </p>
        `
            )
            .join("");
    }

    container.innerHTML = `
    <div class="flex items-center justify-center space-x-4">
                <button id="left-button" class="bg-transparent hover:bg-gray-200 p-2 rounded-full m-0">
            <svg class="w-8 h-8 sm:w-12 sm:h-12 fill-black hover:fill-gray-500 transition-transform transform hover:scale-110" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <polygon points="15,3 3,12 15,21" />
            </svg>
        </button>
        <div class="relative">
            <img src="${
                images.length > 0 ? images[0] : defaultImageUrl
            }" alt="${
        post.media?.[0]?.alt || "Default image"
    }" class="w-[400px] sm:w-[500px] md:w-[600px] cursor-pointer" />
            <p id="imageCounter" class="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-sm sm:text-base md:text-lg font-semibold bg-white px-2 py-1 rounded-md">
                ${
                    images.length > 0
                        ? `Image 1 of ${images.length}`
                        : "No images available"
                }
            </p>
        </div>
        <button id="right-button" class="bg-transparent hover:bg-gray-200 p-2 rounded-full m-0">
            <svg class="w-8 h-8 sm:w-12 sm:h-12 fill-black hover:fill-gray-500 transition-transform transform hover:scale-110" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3 L21 12 L9 21 Z" />
            </svg>
        </button>
    </div>
    <div class="w-3/6 flex flex-col justify-center">
        <div class="text-lg sm:text-xl md:text-2xl">${post.title}</div>
        <div>
            <div class="text-sm sm:text-base md:text-lg">Created at: ${formatTimestamp(
                post.created
            )}</div>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg mb-4" id="timer-${
                post.id
            }"></p>
            <div class="text-sm sm:text-base md:text-lg">Tags: ${
                post.tags ? post.tags.join(", ") : "No tags available"
            }</div>
            <div class="text-sm sm:text-base md:text-lg">Amount of bids: ${
                post._count?.bids || 0
            }</div>
                    ${highestBidInfo}
        </div>
        <div>
        <p class="text-sm sm:text-base md:text-lg">${
            post.description || "No description available"
        }</p>
            </div>
            ${bidContainer}
            <div>
                <button id="viewAllBids" class="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                    View All Bids
                </button>
                <div id="bidsModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div class="bg-white p-4 rounded-lg w-3/4 max-h-[80%] overflow-y-auto">
                        <h2 class="text-lg sm:text-xl font-semibold mb-4">All Bids</h2>
                        <div>${allBids}</div>
                        <button id="closeBidsModal" class="mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200">
                            Close
                        </button>
                    </div>
                </div>
            </div>
    </div>
`;

    const openBidInputButton = document.getElementById("openBidInput");
    if (openBidInputButton) {
        openBidInputButton.addEventListener("click", () => {
            const bidInputContainer =
                document.getElementById("bidInputContainer");
            bidInputContainer.classList.toggle("hidden");
        });
    }

    document
        .getElementById("submitBid")
        ?.addEventListener("click", async () => {
            const bidAmount = parseFloat(
                document.getElementById("bidAmount").value
            );

            if (isNaN(bidAmount) || bidAmount <= 0) {
                alert("Please enter a valid bid amount.");
                return;
            }

            try {
                const myHeaders = await loggedIn();
                const response = await fetch(`${singleListing}${postId}/bids`, {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify({ amount: bidAmount }),
                });

                if (!response.ok) {
                    throw new Error("Failed to place bid. Please try again.");
                }

                alert("Bid placed successfully!");
                displayPost();
            } catch (error) {
                alert(error.message);
            }
        });

    createTimer(post.endsAt, document.getElementById(`timer-${post.id}`));
    updateImage();

    document.getElementById("left-button").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    });

    document.getElementById("right-button").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    });

    document.getElementById("viewAllBids").addEventListener("click", () => {
        document.getElementById("bidsModal").classList.remove("hidden");
    });

    document.getElementById("closeBidsModal").addEventListener("click", () => {
        document.getElementById("bidsModal").classList.add("hidden");
    });
}

displayPost();
