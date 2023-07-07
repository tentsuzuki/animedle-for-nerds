document.addEventListener("DOMContentLoaded", function() {
    const guessInput = document.getElementById("guess");
    const guessButton = document.getElementById("button");
    const result = document.getElementById("result");
    const animeImage = document.getElementById("image");
    
    let animeTitle = "";
    let animeImageUrl = "";
    let attempts = 0;
    const maxAttempts = 5;

    guessButton.addEventListener("click", function() {
        const guess = guessInput.value.trim().toLowerCase();
        guessInput.value = "";

        if (guess === animeTitle) {
            result.textContent = "go outside please";
            guessButton.disabled = true;
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                result.textContent = "wow your bad. title = " + animeTitle;
                guessButton.disabled = true;
            } else {
                result.textContent = `guess harder ${attempts}/${maxAttempts}`;
            }
        }
    });

    fetch('anime-offline-database.json')
        .then(response => response.json())
        .then(data => {
            const randomIndex = getRandomInt(0, data.data.length - 1);
            const randomAnime = data.data[randomIndex];

            animeTitle = randomAnime.title;
            animeImageUrl = randomAnime.picture;
            updateAnimeImage(data);
        })
        .catch(error => {
            console.log(error);
            result.textContent = "failed to get data please try again";
        });

    function updateAnimeImage(data) {
        animeImage.onerror = function() {
            const data = {data: animeTitle, picture:animeImageUrl};
            const randomIndex = getRandomInt(0, data.data.length - 1);
            const randomAnime = data.data[randomIndex];

            animeTitle = randomAnime.title;
            animeImageUrl = randomAnime.picture;
            updateAnimeImage(data);
        }

        animeImage.onload = function() {
            animeImage.onerror = null;
        };

        animeImage.src = animeImageUrl;

        if (animeImageUrl && animeImageUrl.toLowerCase().endsWith(".gif")) {
            const data = { data: animeTitle, picture: animeImageUrl };
            const filteredData = data.data.filter(anime => !anime.picture.toLowerCase().endsWith(".gif"));
            
            if (filteredData.length === 0) {
              console.log("impressive you broke all 22k urls");
              result.textContent = "all the images broke please try again";
              return;
            }
        
            const randomIndex = getRandomInt(0, filteredData.length - 1);
            const randomAnime = filteredData[randomIndex];
        
            animeTitle = randomAnime.title;
            animeImageUrl = randomAnime.picture;
            updateAnimeImage(data);
          } else {
            animeImage.src = animeImageUrl;
          }
        }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

