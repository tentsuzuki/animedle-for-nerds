const input = document.getElementById("guess");
const autocompleteContainer = document.getElementById("autocomplete-items");

input.addEventListener("input", handleInput);

function handleInput() {
    const searchQuery = input.value.trim().toLowerCase();
    
    if (searchQuery.length === 0) {
      clearAutocomplete();
      return;
    }
    
    fetch("./titles/titles.json")
      .then(response => response.json())
      .then(data => {
        const matchingEntries = data.data.filter(entry => {
          const entryTitle = entry.title.toLowerCase();
          const entrySynonyms = entry.synonyms.map(synonym => synonym.toLowerCase());
          return entryTitle.startsWith(searchQuery) || entrySynonyms.some(synonym => synonym.startsWith(searchQuery));
        });
        const matchingTitles = matchingEntries.map(entry => entry.title);
        displayAutocomplete(matchingTitles);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
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
