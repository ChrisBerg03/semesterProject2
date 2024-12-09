export const baseUrl = "https://v2.api.noroff.dev";

export const authBase = `${baseUrl}/auth`;

export const auctionBase = `${baseUrl}/auction`;

export const registerUrl = `${authBase}/register`;

export const loginUrl = `${authBase}/login`;

export const allListings = `${auctionBase}/listings`;

export const activeListings = `${allListings}?_active=true`;

export const singleListing = `${allListings}/`;

export const createListing = allListings; // POST

export const allProfiles = `${auctionBase}/profiles`;

export const singleProfile = (name) => `${allProfiles}/${name}`;
