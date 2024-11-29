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
    console.log(post);
    if (!post || !post.media || !post.media.length) {
        console.error("No media found in the post.");
        return;
    }

    const images = post.media.map((item) => item.url);
    let currentIndex = 0;

    function updateImage() {
        const img = container.querySelector("img");
        img.src = images[currentIndex];
        img.alt = post.media[currentIndex].alt || `Image ${currentIndex + 1}`;

        // Update the image counter text
        document.getElementById("imageCounter").textContent = `(${
            currentIndex + 1
        }/${images.length})`;
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
    }" class="w-[400px] cursor-pointer" />
            <p id="imageCounter" class="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-sm font-semibold bg-white px-2 py-1 rounded-md">
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
            <div>${post.title}</div>
            <div>
                <div>Created: ${new Date(post.created).toLocaleString()}</div>
                <div>Ends at: ${new Date(post.endsAt).toLocaleString()}</div>
                <div>${post.tags}</div>
                <div>${post._count.bids}</div>
            </div>
            <div>
                <p>${post.description}</p>
            </div>
        </div>
    `;

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
