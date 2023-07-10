const input = document.getElementById("guess");
const autocompleteContainer = document.getElementById("autocomplete-items");

input.addEventListener("input", handleInput);

function handleInput() {
  const searchQuery = input.value.trim().toLocaleLowerCase('en-US');

  if (searchQuery.length === 0) {
    clearAutocomplete();
    return;
  }

  fetch("./titles/titles4.json")
    .then(response => response.json())
    .then(data => {
      const matchingEntries = data.data.filter(entry => {
        const entryTitle = entry.title.toLocaleLowerCase('en-US');
        const entrySynonyms = entry.synonyms.map(synonym => synonym.toLocaleLowerCase('en-US'));
        const regex = new RegExp(`^${escapeRegExp(searchQuery)}`);
        return regex.test(entryTitle) || entrySynonyms.some(synonym => regex.test(synonym));
      });
      const matchingTitles = matchingEntries.map(entry => entry.title);
      displayAutocomplete(matchingTitles);
    })
    .catch(error => {
      console.log("Error fetching data:", error);
    });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displayAutocomplete(entries) {
    clearAutocomplete();
    
    const dropdown = document.createElement("div");
    dropdown.classList.add("autocomplete-items");
    
    entries.forEach(entry => {
      const item = document.createElement("div");
      item.textContent = entry;
      item.addEventListener("click", () => {
        input.value = entry;
        clearAutocomplete();
      });
      dropdown.appendChild(item);
    });
    
    autocompleteContainer.appendChild(dropdown);
  }
  

function clearAutocomplete() {
  while (autocompleteContainer.firstChild) {
    autocompleteContainer.removeChild(autocompleteContainer.firstChild);
  }
}
