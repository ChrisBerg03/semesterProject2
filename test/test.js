const baseUrl = "https://v2.api.noroff.dev";
const registerUrl = baseUrl + "/auth/register";
const loginUrl = baseUrl + "/auth/login";
const allListings = baseUrl + "/auction/listings";
let singleId = "";
const singleListing = allListings + "/" + singleId;
const createListing = baseUrl + "/auction/listings"; //POST
const allProfiles = baseUrl + "/auction/profiles";
let name = "";
const singleProfile = allProfiles + "/" + name;