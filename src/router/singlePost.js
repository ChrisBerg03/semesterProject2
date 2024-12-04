import { singleListing } from "../api/constants";
import { navHeader } from "../ui/header";
navHeader();

document.getElementById("profileImg").src =
    localStorage.getItem("avatar") ||
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

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
    console.log(post);
    if (!post || !post.media || !post.media.length) {
        console.error("No media found in the post.");
        return;
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
        updateTimer(); // Run it immediately
    }

    const images = post.media.map((item) => item.url);
    let currentIndex = 0;

    function updateImage() {
        const img = container.querySelector("img");
        img.src = images[currentIndex];
        img.alt = post.media[currentIndex].alt || `Image ${currentIndex + 1}`;

        document.getElementById("imageCounter").textContent = `Image ${
            currentIndex + 1
        } of ${images.length}`;
    }

    let bidContainer = "";
    if (localStorage.getItem("accessToken")) {
        bidContainer = `
            <div class="mt-4">
                <a href="../../bid/" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">Place Bid</a>
            </div>
        `;
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

    container.innerHTML = `
        <div class="flex items-center justify-center space-x-4">
            <button id="left-button" class="bg-transparent hover:bg-gray-200 p-2 rounded-full m-0">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 fill-black hover:fill-blue-500 transition-transform transform hover:scale-110" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="15,3 3,12 15,21" />
                </svg>
            </button>
            <div class="relative">
                <img src="${images[0]}" alt="${
        post.media[0].alt || "Image"
    }" class="w-[400px] sm:w-[500px] md:w-[600px] cursor-pointer" />
                <p id="imageCounter" class="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-sm sm:text-base md:text-lg font-semibold bg-white px-2 py-1 rounded-md">
                    Image 1 of ${images.length}
                </p>
            </div>
            <button id="right-button" class="bg-transparent hover:bg-gray-200 p-2 rounded-full m-0">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 fill-black hover:fill-blue-500 transition-transform transform hover:scale-110" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        </div>
        ${bidContainer}
    `;

    const timerElement = document.getElementById(`timer-${post.id}`);
    createTimer(post.endsAt, timerElement);

    document.getElementById("left-button").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    });

    document.getElementById("right-button").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    });

    updateImage();
}

displayPost();

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
