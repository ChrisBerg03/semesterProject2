async function getData() {
    try {
        const response = await fetch(
            "https://v2.api.noroff.dev/auction/listings"
        );
        const data = await response.json();
        return data.data;
    } catch (error) {
        alert("There was an error fetching posts. Please try again later.");
        return [];
    }
}

async function displayData() {
    const posts = await getData();
    console.log(posts);
}

displayData();
