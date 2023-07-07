document.addEventListener("DOMContentLoaded", function() {
    const guessInput = document.getElementById("guess");
    const guessButton = document.getElementById("button");
    const result = document.getElementById("result");
    const animeImage = document.getElementById("image");
  
    let animeTitle = "";
    let animeImageUrl = "";
    let attempts = 0;
    const maxAttempts = 5;
  
    guessButton.addEventListener("click", checkGuess);
  
    function checkGuess() {
      const guess = guessInput.value.trim().toLowerCase();
      guessInput.value = "";
  
      if (guess === animeTitle) {
        result.textContent = "go outside please";
        guessButton.disabled = true;
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          result.textContent = `wow ur bad. title: ${animeTitle}`;
          guessButton.disabled = true;
        } else {
          result.textContent = `guess harder: attempt ${attempts}/${maxAttempts}`;
        }
      }
    }
  
    fetch('anime.json')
      .then(response => response.json())
      .then(data => {
        let randomAnime = getRandomAnime(data.data);
  
        animeTitle = randomAnime.title;
        animeImageUrl = randomAnime.picture;
        updateAnimeImage();
      })
      .catch(error => {
        console.log(error);
        result.textContent = "something wrong happened";
      });
  
    function updateAnimeImage() {
      animeImage.src = animeImageUrl;
    }
  
    function getRandomAnime(animeData) {
      const randomIndex = Math.floor(Math.random() * animeData.length);
      return animeData[randomIndex];
    }
  });
  