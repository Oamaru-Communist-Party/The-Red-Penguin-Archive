function performSearch() {
    const query = document.getElementById("searchBar").value.toLowerCase();

    fetch("index.json")
        .then(response => response.json())
        .then(data => {
            const results = data.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.tags.join(" ").toLowerCase().includes(query)
            );

            displayResults(results);
        })
        .catch(error => {
            console.error("Error loading JSON:", error);
        });
}

function displayResults(results) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = "<p>No results found.</p>";
        return;
    }

    results.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <p><strong>Tags:</strong> ${item.tags.join(", ")}</p>
            <a href="${item.link}">Open</a>
            <hr>
        `;
        container.appendChild(div);
    });
}
