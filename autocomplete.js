function autocomplete(input, data) {
    let currentFocus;
  
    input.addEventListener("input", function() {
      const value = this.value;
      closeAllLists();
  
      if (!value) {
        return;
      }
  
      currentFocus = -1;
  
      const matches = data.filter(function(item) {
        return item.toLowerCase().startsWith(value.toLowerCase());
      });
  
      if (matches.length === 0) {
        return;
      }
  
      const autocompleteList = document.createElement("div");
      autocompleteList.setAttribute("id", this.id + "-autocomplete-list");
      autocompleteList.setAttribute("class", "autocomplete-items");
  
      this.parentNode.appendChild(autocompleteList);
  
      for (let i = 0; i < matches.length; i++) {
        const option = document.createElement("div");
        const matchStart = matches[i].toLowerCase().indexOf(value.toLowerCase());
        const matchEnd = matchStart + value.length;
        option.innerHTML = "<strong>" + escapeHTML(matches[i].slice(0, matchEnd)) + "</strong>";
        option.innerHTML += escapeHTML(matches[i].slice(matchEnd));
        option.innerHTML += "<input type='hidden' value='" + escapeHTML(matches[i]) + "'>";
  
        option.addEventListener("click", function() {
          input.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
  
        autocompleteList.appendChild(option);
      }
    });
  
  
    input.addEventListener("keydown", function(e) {
      const autocompleteList = document.getElementById(this.id + "-autocomplete-list");
  
      if (autocompleteList) {
        const options = autocompleteList.getElementsByTagName("div");
  
        if (e.keyCode === 40) { // down arrow
          currentFocus++;
  
          setActiveOption(options);
        } else if (e.keyCode === 38) { // up arrow
          currentFocus--;
  
          setActiveOption(options);
        } else if (e.keyCode === 13) { // enter key
          e.preventDefault();
  
          if (currentFocus > -1) {
            if (options) {
              options[currentFocus].click();
            }
          }
        }
      }
    });
  
    function setActiveOption(options) {
      if (!options) {
        return;
      }
  
      removeActiveOption(options);
  
      if (currentFocus >= options.length) {
        currentFocus = 0;
      }
  
      if (currentFocus < 0) {
        currentFocus = options.length - 1;
      }
  
      options[currentFocus].classList.add("autocomplete-active");
    }
  
    function removeActiveOption(options) {
      for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("autocomplete-active");
      }
    }
  
    function closeAllLists() {
      const autocompleteLists = document.getElementsByClassName("autocomplete-items");
  
      for (let i = 0; i < autocompleteLists.length; i++) {
        autocompleteLists[i].parentNode.removeChild(autocompleteLists[i]);
      }
    }
  
    document.addEventListener("click", function(e) {
      closeAllLists(e.target);
    });

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
      }
  }