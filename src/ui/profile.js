import { navHeader } from "./header";
import { allProfiles } from "../api/constants";
import { loggedIn } from "../api/headers";

navHeader();

const profileName = localStorage.getItem("name");

async function getData() {
    try {
        if (!profileName) {
            alert("Profile name is not available in localStorage.");
            return null;
        }

        const myHeaders = await loggedIn();
        const response = await fetch(`${allProfiles}/${profileName}`, {
            method: "GET",
            headers: myHeaders,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (error) {
        console.error("Error fetching profile data:", error);
        alert(
            "There was an error fetching the profile. Please try again later."
        );
        return null;
    }
}

function displayProfile(profile) {
    const profileContainer = document.getElementById("profileContainer");

    if (!profileContainer) {
        console.error("Profile container element not found!");
        return;
    }

    if (!profile) {
        profileContainer.innerHTML = `
            <div class="text-center text-red-500 font-bold">
                Failed to load profile data.
            </div>`;
        return;
    }

    const bannerUrl =
        profile.banner?.url ||
        "https://via.placeholder.com/1500x500?text=No+Banner+Available";
    const bannerAlt = profile.banner?.alt || "Default banner image";

    const avatarUrl =
        profile.avatar?.url ||
        "https://via.placeholder.com/400x400?text=No+Avatar+Available";
    const avatarAlt = profile.avatar?.alt || "Default avatar image";

    profileContainer.innerHTML = `
    <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="relative">
            <img src="${bannerUrl}" alt="${bannerAlt}" class="w-full h-48 object-cover">
            <div class="absolute top-4 left-4">
                <img src="${avatarUrl}" alt="${avatarAlt}" class="w-20 h-20 rounded-full border-4 border-white shadow-lg">
            </div>
        </div>
        <div class="px-6 py-4">
            <h1 class="text-2xl font-bold text-gray-800">${profile.name}</h1>
            <p class="text-sm text-gray-500">${profile.email}</p>
            <p class="mt-4 text-gray-700">${
                profile.bio || "No bio available."
            }</p>
            <div class="mt-6 flex justify-between items-center">
                <div id="listingsBtn" class="text-center cursor-pointer">
                    <h2 class="text-lg font-bold text-gray-800">${
                        profile._count?.listings || 0
                    }</h2>
                    <p class="text-sm text-gray-500" >Listings</p>
                </div>
                <div class="text-center">
                    <h2 class="text-lg font-bold text-gray-800">${
                        profile._count?.wins || 0
                    }</h2>
                    <p class="text-sm text-gray-500">Wins</p>
                </div>
                <div class="text-center">
                    <h2 class="text-lg font-bold text-gray-800">${
                        profile.credits || 0
                    }</h2>
                    <p class="text-sm text-gray-500">Credits</p>
                </div>
                <button id="editProfileBtn" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                    Edit Profile
                </button>
            </div>
        </div>
    </div>
`;

    document
        .getElementById("listingsBtn")
        .addEventListener("click", () => displayListings(profile.name));
    const editButton = document.getElementById("editProfileBtn");
    editButton.addEventListener("click", () => enableEditing(profile));
}

function enableEditing(profile) {
    const profileContainer = document.getElementById("profileContainer");

    profileContainer.innerHTML = `
        <form class="space-y-6 bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
            <div>
                <label for="editBio" class="block text-sm font-medium text-gray-700">Bio</label>
                <textarea id="editBio" class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4">${
                    profile.bio || ""
                }</textarea>
            </div>

            <div class="mt-4">
                <label for="editAvatarUrl" class="block text-sm font-medium text-gray-700">Avatar URL</label>
                <input id="editAvatarUrl" type="text" value="${
                    profile.avatar?.url || ""
                }" class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div class="mt-4">
                <label for="editAvatarAlt" class="block text-sm font-medium text-gray-700">Avatar Alt</label>
                <input id="editAvatarAlt" type="text" value="${
                    profile.avatar?.alt || ""
                }" class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div class="mt-4">
                <label for="editBannerUrl" class="block text-sm font-medium text-gray-700">Banner URL</label>
                <input id="editBannerUrl" type="text" value="${
                    profile.banner?.url || ""
                }" class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div class="mt-4">
                <label for="editBannerAlt" class="block text-sm font-medium text-gray-700">Banner Alt</label>
                <input id="editBannerAlt" type="text" value="${
                    profile.banner?.alt || ""
                }" class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div class="mt-6 flex justify-end space-x-4">
                <button id="saveProfileBtn" type="submit" class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200">
                    Save
                </button>
                <button id="cancelEditBtn" type="button" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200">
                    Cancel
                </button>
            </div>
        </form>
    `;

    document
        .getElementById("saveProfileBtn")
        .addEventListener("click", () => saveProfile(profile));
    document
        .getElementById("cancelEditBtn")
        .addEventListener("click", () => displayProfile(profile));
}
async function displayListings(profileName) {
    const profileContainer = document.getElementById("profileContainer");

    try {
        const myHeaders = await loggedIn();
        const response = await fetch(
            `https://v2.api.noroff.dev/auction/profiles/${profileName}/listings`,
            {
                method: "GET",
                headers: myHeaders,
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const listings = await response.json();
        console.log(listings); // Logs the entire response

        if (listings.data.length === 0) {
            profileContainer.innerHTML += `
                <div class="text-center text-gray-500 font-bold">
                    No listings available for this profile.
                </div>`;
            return;
        }

        const listingsHTML = listings.data
            .map((listing) => {
                const media = listing.media?.[0];
                const listingImg =
                    media && media.url
                        ? `<img class="w-full h-48 object-cover rounded-t-lg" src="${
                              media.url
                          }" alt="${media.alt || "Listing image"}">`
                        : "";

                return `
                <div class="w-full bg-white shadow-md rounded-lg mb-4 hover:shadow-lg transition-shadow duration-200 ease-in-out">
                    ${listingImg}
                    <div class="p-4">
                        <h3 class="text-lg font-semibold text-gray-800">${
                            listing.title
                        }</h3>
                        <p class="text-sm text-gray-500">${
                            listing.description || "No description available."
                        }</p>
                        <p class="text-sm text-gray-500">Created: ${new Date(
                            listing.created
                        ).toLocaleDateString()}</p>
<a class="redirectBtn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4 cursor-pointer" data-id="${
                    listing.id
                }">
    View Details
</a>

                    </div>
                </div>`;
            })
            .join("");

        profileContainer.innerHTML += `
            <div class="mt-6 flex flex-col space-y-4">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Listings</h2>
            ${listingsHTML}
            </div>`;
    } catch (error) {
        console.error("Error fetching listings:", error);
        profileContainer.innerHTML += `
            <div class="mt-6 flex flex-col space-y-4">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Listings</h2>
            ${listingsHTML}
            </div>`;
    }
    const redirectButtons = document.querySelectorAll(".redirectBtn");
    redirectButtons.forEach((btn) =>
        btn.addEventListener("click", (event) => {
            const postId = event.currentTarget.dataset.id;
            sessionStorage.setItem("postId", postId);
            window.location.href = "/post/";
        })
    );
}

async function saveProfile(profile) {
    const updatedProfile = {
        bio: document.getElementById("editBio").value,
        avatar: {
            url: document.getElementById("editAvatarUrl").value,
            alt: document.getElementById("editAvatarAlt").value,
        },
        banner: {
            url: document.getElementById("editBannerUrl").value,
            alt: document.getElementById("editBannerAlt").value,
        },
    };

    try {
        const myHeaders = await loggedIn();
        const response = await fetch(`${allProfiles}/${profile.name}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(updatedProfile),
        });

        if (response.ok) {
            const updatedData = await response.json();
            alert("Profile updated successfully!");
            displayProfile(updatedData.data);
        } else {
            const error = await response.json();
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    } catch (error) {
        console.error("Error during PUT request:", error);
        alert("An error occurred while updating the profile.");
    }
}

async function initializeProfile() {
    const profileData = await getData();
    if (profileData) {
        displayProfile(profileData);
    }
}

initializeProfile();
