let movies = [];

async function loadMovies() {
    const res = await fetch("movies.json");
    movies = await res.json();
}

const ratingOrder = {
    "G": 0,
    "PG": 1,
    "PG-13": 2,
    "R": 3,
    "NC-17": 4,
    "UNRATED": 5
};

function allowed(movieRating, limit) {
    return (ratingOrder[movieRating] ?? 0)
        <= ratingOrder[limit];
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function generate365() {

    const limit =
        document.getElementById("ratingFilter").value;

    let pool = movies.filter(m =>
        allowed(m.rating, limit)
    );

    shuffle(pool);

    const schedule = pool.slice(0, 365);

    render(schedule);
}

function render(list) {

    const container =
        document.getElementById("movieList");

    container.innerHTML = "";

    list.forEach((m, i) => {

        container.innerHTML += `
        <div class="movie-card">
            <div class="day">Day ${i + 1}</div>
            <h2>${m.title}</h2>
            <p>${m.year}</p>
            <p>${m.rating}</p>
            <p>${m.genres.join(", ")}</p>
        </div>
        `;
    });
}

loadMovies();
