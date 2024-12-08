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
                <h1 class="text-2xl font-bold text-gray-800">${
                    profile.name
                }</h1>
                <p class="text-sm text-gray-500">${profile.email}</p>
                <p class="mt-4 text-gray-700">${
                    profile.bio || "No bio available."
                }</p>
                <div class="mt-6 flex justify-between items-center">
                    <div class="text-center">
                        <h2 class="text-lg font-bold text-gray-800">${
                            profile._count?.listings || 0
                        }</h2>
                        <p class="text-sm text-gray-500">Listings</p>
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

    const editButton = document.getElementById("editProfileBtn");
    editButton.addEventListener("click", () => enableEditing(profile));
}

function enableEditing(profile) {
    const profileContainer = document.getElementById("profileContainer");

    // Replace profile container with editable form
    profileContainer.innerHTML = `
        <div>
            <label class="block text-sm font-medium text-gray-700">Bio</label>
            <textarea id="editBio" class="w-full mt-1 px-4 py-2 border rounded-lg">${
                profile.bio || ""
            }</textarea>
        </div>
        <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input id="editAvatarUrl" type="text" value="${
                profile.avatar?.url || ""
            }" class="w-full mt-1 px-4 py-2 border rounded-lg">
        </div>
        <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Avatar Alt</label>
            <input id="editAvatarAlt" type="text" value="${
                profile.avatar?.alt || ""
            }" class="w-full mt-1 px-4 py-2 border rounded-lg">
        </div>
        <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Banner URL</label>
            <input id="editBannerUrl" type="text" value="${
                profile.banner?.url || ""
            }" class="w-full mt-1 px-4 py-2 border rounded-lg">
        </div>
        <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Banner Alt</label>
            <input id="editBannerAlt" type="text" value="${
                profile.banner?.alt || ""
            }" class="w-full mt-1 px-4 py-2 border rounded-lg">
        </div>
        <div class="mt-6 flex justify-end space-x-4">
            <button id="saveProfileBtn" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                Save
            </button>
            <button id="cancelEditBtn" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                Cancel
            </button>
        </div>
    `;

    // Attach event listeners for Save and Cancel buttons
    document
        .getElementById("saveProfileBtn")
        .addEventListener("click", () => saveProfile(profile));
    document
        .getElementById("cancelEditBtn")
        .addEventListener("click", () => displayProfile(profile));
}

async function saveProfile(profile) {
    // Get updated values from input fields
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
            displayProfile(updatedData.data); // Fix to display the updated profile
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
