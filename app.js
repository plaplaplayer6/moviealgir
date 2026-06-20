let movies = [];

async function loadMovies() {
    try {
        const res = await fetch("movies.json");
        movies = await res.json();
        console.log("Loaded movies:", movies.length);
    } catch (err) {
        console.error("movies.json failed to load", err);
    }
}

const ratingOrder = {
    "G": 0,
    "PG": 1,
    "PG-13": 2,
    "R": 3,
    "NC-17": 4,
    "UNRATED": 5
};

function allowed(rating, limit) {
    return (ratingOrder[rating] ?? 0)
        <= ratingOrder[limit];
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function generate365() {

    if (!movies.length) {
        alert("Movies not loaded yet");
        return;
    }

    const limit =
        document.getElementById("ratingFilter").value;

    let pool = movies.filter(m =>
        allowed(m.rating, limit)
    );

    shuffle(pool);

    render(pool.slice(0, 365));
}

function render(list) {

    const el = document.getElementById("movieList");

    el.innerHTML = "";

    list.forEach((m, i) => {

        el.innerHTML += `
            <div class="movie-card">
                <h3>Day ${i + 1}</h3>
                <h2>${m.title}</h2>
                <p>${m.year}</p>
                <p>${m.rating}</p>
                <p>${(m.genres || []).join(", ")}</p>
            </div>
        `;
    });
}

loadMovies();
