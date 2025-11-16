let archive = [];

async function loadArchive() {
  const response = await fetch('index.json');
  archive = await response.json();
}

function searchArchive() {
  const query = document.getElementById('search').value.toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  const results = archive.filter(entry =>
    entry.title.toLowerCase().includes(query) ||
    entry.tags.join(" ").toLowerCase().includes(query) ||
    entry.description.toLowerCase().includes(query)
  );

  results.forEach(entry => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.description}</p>
      <p><strong>Tags:</strong> ${entry.tags.join(", ")}</p>
      <a href="${entry.link}" target="_blank">Open File</a>
      <hr>
    `;
    resultsDiv.appendChild(div);
  });
}

loadArchive();
