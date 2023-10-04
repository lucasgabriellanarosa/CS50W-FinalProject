const updateActiveNavBtn = (currentPage) => {
    document.querySelector(`#${currentPage}`).classList.add("active")
}

const loadRelationsBtns = async(animeId, animeName, animeEps, animeScore, animeImg, data) => {
    
    let btnContainer = document.querySelector(`#btnContainer_${animeId}`)

    if(data.is_anime_favorited){
        btnContainer.innerHTML += `<button id='likeBtn_${animeId}' class='fa-solid fa-heart' style='color: #000000;'></button>`
    }else{
        btnContainer.innerHTML += `<button id='likeBtn_${animeId}' class='fa-regular fa-heart' style='color: #000000;'></button>`
    }

    if(data.is_anime_watchlist){
        btnContainer.innerHTML += `<button id='watchlistBtn_${animeId}' class='fa-solid fa-clock' style='color: #000000;'></button>`
    }else{
        btnContainer.innerHTML += `<button  id='watchlistBtn_${animeId}' class='fa-regular fa-clock' style='color: #000000;'></button>`
    }

    if(data.is_anime_watched){
        btnContainer.innerHTML += `<button id='watchedBtn_${animeId}' class='fa-solid fa-eye' style='color: #000000;'></button>`
    }else{
        btnContainer.innerHTML += `<button id='watchedBtn_${animeId}' class='fa-regular fa-eye' style='color: #000000;'></button>`
    }


    const animeData = {
        id: animeId,
        title: animeName,
        score: animeScore,
        episodes: animeEps,
        img: animeImg
    }
    
    let likeBtn = document.querySelector(`#likeBtn_${animeId}`)

    likeBtn.addEventListener("click", async ()=>{
        await fetch(`/likeLogic/${animeId}`, {
            method: "POST",
            body: JSON.stringify({ data: animeData }),
        })
        .then(response => response.json())
        .then(data => {
            btnClicked = document.querySelector(`#likeBtn_${animeId}`)
            if(data.is_anime_favorited){
                btnClicked.className = "fa-solid fa-heart"
            }else{
                btnClicked.className = "fa-regular fa-heart"
            }
        })
    })


    let watchlistBtn = document.querySelector(`#watchlistBtn_${animeId}`)
    
    watchlistBtn.addEventListener("click", async () => {
        await fetch(`/watchlistLogic/${animeId}`, {
            method: "POST",
            body: JSON.stringify({ data: animeData }),
        })
        .then(response => response.json())
        .then(data => {
            btnClicked = document.querySelector(`#watchlistBtn_${animeId}`)
            if(data.is_anime_watchlist){
                btnClicked.className = "fa-solid fa-clock"
            }else{
                btnClicked.className = "fa-regular fa-clock"
            }
        })
    })


    let watchedBtn = document.querySelector(`#watchedBtn_${animeId}`)

    watchedBtn.addEventListener("click", async () => {
        await fetch(`/watchedLogic/${animeId}`, {
            method: "POST",
            body: JSON.stringify({ data: animeData }),
        })
        .then(response => response.json())
        .then(data => {
            btnClicked = document.querySelector(`#watchedBtn_${animeId}`)
            if(data.is_anime_watched){
                btnClicked.className = "fa-solid fa-eye"
            }else{
                btnClicked.className = "fa-regular fa-eye"
            }
        })
    })

}


const callPage = (page) => {
    switch(page){
        case "top":
            loadTopAnimes()
            break;

        case "genres":
            loadGenresList()
            break;

        case "favorites":
            loadFavorites()
            break;

        case "watchlist":
            loadWatchlist()
            break;

        case "watched":
            loadAlreadyWatched()
            break;

        case "profile":
            loadProfile()
            break;
    }

}

const loadFavorites = async() => {
    await fetch(`/getUserFavorites`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#root").innerHTML = `
        <h2>Favorites</h2>
        <ul class="animeList list-unstyled" id="favoritesList">
        </ul>
        `
        const favoritesList = document.querySelector("#favoritesList")
        const favorites = JSON.parse(data);
     
        
        favorites.forEach(anime => {
            fetch(`https://api.jikan.moe/v4/anime/${anime.fields.animeId}`)
            .then(response => response.json())
            .then(animeData => {
                favoritesList.innerHTML += `
                <li data-animeCard id="${animeData.data.mal_id}" class="card mb-3" style="max-width: 540px;">
                    <div class="row g-0 animeCard">
                        <div class="col-md-4" style="display: flex; justify-content:center;">
                            <img src="${animeData.data.images.jpg.image_url}" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${animeData.data.title}</h5>
                            <p class="card-text">Episodes: ${animeData.data.episodes}</p>
                            <p class="card-text"><small class="text-body-secondary">Score: ${animeData.data.score}</small></p>
                            <div id="btnContainer_${animeData.data.mal_id}">
                            </div>
                            <button data-animeDetailsBtn id="${animeData.data.mal_id}" class="btn btn-outline-info">Details</button>
                        </div>
                        </div>
                    </div>
                </li>
                `
                fetch(`/getUserRelationWithAnime/${anime.fields.animeId}`)
                .then(response => response.json())
                .then(data => {
                    loadRelationsBtns(anime.fields.animeId, data)
                })

                const animeDetailsBtns = document.querySelectorAll("[data-animeDetailsBtn]")
        
                animeDetailsBtns.forEach(btn => {
                    btn.addEventListener("click", () => {
                        loadAnimeDetails(btn.id)
                    })
                });
            })
        });


        
    })
}

const loadWatchlist = async() => {
    await fetch(`/getUserWatchlist`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#root").innerHTML = `
        <h2>Watchlist</h2>
        <ul class="animeList list-unstyled" id="watchlistList">
        </ul>
        `
        const watchlistList = document.querySelector("#watchlistList")
        const watchlist = JSON.parse(data);
        
        watchlist.forEach(anime => {
            fetch(`https://api.jikan.moe/v4/anime/${anime.fields.animeId}`)
            .then(response => response.json())
            .then(animeData => {
                watchlistList.innerHTML += `
                <li data-animeCard id="${animeData.data.mal_id}" class="card mb-3" style="max-width: 540px;">
                    <div class="row g-0 animeCard">
                        <div class="col-md-4" style="display: flex; justify-content:center;">
                            <img src="${animeData.data.images.jpg.image_url}" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${animeData.data.title}</h5>
                            <p class="card-text">Episodes: ${animeData.data.episodes}</p>
                            <p class="card-text"><small class="text-body-secondary">Score: ${animeData.data.score}</small></p>
                            <div id="btnContainer_${animeData.data.mal_id}">
                            </div>
                            <button data-animeDetailsBtn id="${animeData.data.mal_id}" class="btn btn-outline-info">Details</button>
                        </div>
                        </div>
                    </div>
                </li>
                `

                const animeDetailsBtns = document.querySelectorAll("[data-animeDetailsBtn]")

                animeDetailsBtns.forEach(btn => {
                    btn.addEventListener("click", () => {
                        loadAnimeDetails(btn.id)
                    })
                });
    
                fetch(`/getUserRelationWithAnime/${anime.fields.animeId}`)
                .then(response => response.json())
                .then(data => {
                    loadRelationsBtns(anime.fields.animeId, data)
                })
            })


        });
    })

}

const loadAlreadyWatched = async() => {
    await fetch(`/getUserWatched`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#root").innerHTML = `
        <h2>Watched</h2>
        <ul class="animeList list-unstyled" id="watchedList">
        </ul>
        `
        const watchedList = document.querySelector("#watchedList")
        const watched = JSON.parse(data);
        watched.forEach(anime => {
            fetch(`https://api.jikan.moe/v4/anime/${anime.fields.animeId}`)
            .then(response => response.json())
            .then(animeData => {
                watchedList.innerHTML += `
                <li data-animeCard id="${animeData.data.mal_id}" class="card mb-3" style="max-width: 540px;">
                    <div class="row g-0 animeCard">
                        <div class="col-md-4" style="display: flex; justify-content:center;">
                            <img src="${animeData.data.images.jpg.image_url}" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${animeData.data.title}</h5>
                            <p class="card-text">Episodes: ${animeData.data.episodes}</p>
                            <p class="card-text"><small class="text-body-secondary">Score: ${animeData.data.score}</small></p>
                            <div id="btnContainer_${animeData.data.mal_id}">
                            </div>
                            <button data-animeDetailsBtn id="${animeData.data.mal_id}" class="btn btn-outline-info">Details</button>
                        </div>
                        </div>
                    </div>
                </li>
                `
                const animeDetailsBtns = document.querySelectorAll("[data-animeDetailsBtn]")

                animeDetailsBtns.forEach(btn => {
                    btn.addEventListener("click", () => {
                        loadAnimeDetails(btn.id)
                    })
                });
    
                fetch(`/getUserRelationWithAnime/${anime.fields.animeId}`)
                .then(response => response.json())
                .then(data => {
                    loadRelationsBtns(anime.fields.animeId, data)
                })
            })
        });
    })

}

const loadProfile = async() => {
    document.querySelector("#root").innerHTML = `
    `
}
