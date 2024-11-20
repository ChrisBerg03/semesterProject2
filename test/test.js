const baseUrl = "https://v2.api.noroff.dev";
const authBase = `${baseUrl}/auth`;
const auctionBase = `${baseUrl}/auction`;

const registerUrl = `${authBase}/register`;
const loginUrl = `${authBase}/login`;
const allListings = `${auctionBase}/listings`;
const singleListing = (singleId) => `${allListings}/${singleId}`;
const createListing = allListings; // POST
const allProfiles = `${auctionBase}/profiles`;
const singleProfile = (name) => `${allProfiles}/${name}`;
