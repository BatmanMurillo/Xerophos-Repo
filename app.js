// Agregar el evento para abrir/cerrar el menú lateral
const menuButton = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const body = document.body;
//example

// Agregar un evento para mostrar/ocultar el menú
menuButton.addEventListener("click", function() {
    menu.classList.toggle("show"); // Alterna la clase 'show' para mostrar/ocultar el menú
    body.classList.toggle("menu-active"); // Activa/desactiva el desplazamiento del contenido
});


/* --------------------------------------------------------------------------------------------------------- */

// Dummy de artistas y búsqueda con mejor match + redirección

const artists = [
    { name: 'Luam', url: 'https://batmanmurillo.github.io/Xerophos-Repo/Luam.html' },
    { name: 'Luma', url: 'https://batmanmurillo.github.io/Xerophos-Repo/Luma.html' },
    { name: 'Otro Artista', url: 'https://batmanmurillo.github.io/Xerophos-Repo/Otro.html' },
    { name: 'Otro artista', url: 'https://batmanmurillo.github.io/Xerophos-Repo/Otro.html' }
];

function normalize(s) {
    return String(s || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}

// distancia de Levenshtein
function levenshtein(a, b) {
    a = a || ''; b = b || '';
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({length: m + 1}, () => new Array(n + 1));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i-1] === b[j-1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i-1][j] + 1,
                dp[i][j-1] + 1,
                dp[i-1][j-1] + cost
            );
        }
    }
    return dp[m][n];
}

function scoreMatch(query, target) {
    const q = normalize(query);
    const t = normalize(target);
    if (!q) return -Infinity;
    if (q === t) return 100;
    if (t.startsWith(q)) return 90;
    if (t.includes(q)) return 75;
    // usar Levenshtein para aproximaciones
    const dist = levenshtein(q, t);
    const maxLen = Math.max(q.length, t.length);
    const similarity = Math.max(0, 60 - (dist * 10 / Math.max(1, maxLen))); // escala simple
    return similarity;
}

function findBestArtist(query) {
    const scored = artists.map(a => ({ artist: a, score: scoreMatch(query, a.name) }));
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    return (best && best.score > 20) ? best.artist : null; // umbral
}

// manejador del formulario de búsqueda
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');

    if (!form || !input) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = input.value || '';
        const match = findBestArtist(q);
        if (match) {
            // redirigir al resultado
            window.location.href = match.url;
        } else {
            // puedes cambiar esto por un modal o mensaje en la UI
            alert('No se encontró ningún artista que coincida con: ' + q);
        }
    });
});
