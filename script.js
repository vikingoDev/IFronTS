// Función de filleado de cards
document.getElementById("saveButton").addEventListener("click", () => {    
    const titulo = document.getElementById("titulo").value;
    const link = document.getElementById("link").value;
    const descripcion = document.getElementById("descripcion").value;

    // Validación de campos para que no puedan generar card sin información completa
    if (!titulo || !link || !descripcion) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    // Guardar objeto en localStorage
    const cardData = { titulo, link, descripcion };
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    savedCards.push(cardData);
    localStorage.setItem("cards", JSON.stringify(savedCards));

    // Clean & close modal
    document.getElementById("titulo").value = "";
    document.getElementById("link").value = "";
    document.getElementById("descripcion").value = "";
    document.querySelector("#newCardModal .btn-close").click();

    // Renderizar card
    renderCard(cardData);
});
// Agrego un "Enter" al "Guardar" porque si no es una paja
document.getElementById("newCardModal").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        document.getElementById("saveButton").click();
    }
});


// Renderizado de cards
async function renderCard({ titulo, link, descripcion }) {    
    const fullLink = link.startsWith('http') ? link : `https://${link}`;
    const thumbnail = 'https://via.placeholder.com/150';
    const cardContainer = document.getElementById("cardContainer");
    const card = document.createElement("a");
    card.href = fullLink;
    card.target = "_blank";
    card.className = "card m-4 addCard";
    card.id = "modCard";
    const titleWithUrl = `${titulo} (${fullLink})`;

    card.innerHTML = `
        <!-- <img src="${thumbnail}" alt="Thumbnail" class="card-img-top"> -->
        <div class="card-body">
            <h5 class="card-title">${titleWithUrl}</h5>
            <p class="card-text">${descripcion}</p>
        </div>
    `;
    // Se deja el thumbnail en semi "display: none" porque es un quilombo generarlos, requiere web scrapping y no tengo ganas de lidiar con esto ahora 😅
    cardContainer.appendChild(card);
}

// Renderizar cards guardadas al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    savedCards.forEach(renderCard);
});

// Vaciar local storage (menos el adder) y larga un toast avisando que borró todo
function clearLocalStorage() {
    localStorage.removeItem("cards");
    const cardContainer = document.getElementById("cardContainer");

    [...cardContainer.children].forEach(child => {
        if (!child.classList.contains("adder")) {
            cardContainer.removeChild(child);
        }
    });
    
    const toastMessage = document.getElementById("toastMessage");
    toastMessage.classList.add("show");

    setTimeout(() => {
        toastMessage.classList.remove("show");
        location.reload();
    }, 500);
}

// Exportar cards a archivo CSV
function exportToCSV() {
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    const csvContent = "data:text/csv;charset=utf-8," +
        savedCards.map(card => `${card.titulo},${card.link},${card.descripcion}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cards.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Importar cards desde CSV a localStorage, renderiza y refreshea
function importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        const rows = csvContent.split("\n");
        const importedCards = rows.map(row => {
            const [titulo, link, descripcion] = row.split(",");
            return { titulo, link, descripcion };
        });
        
        localStorage.setItem("cards", JSON.stringify(importedCards));
        document.getElementById("cardContainer").innerHTML = "";
        importedCards.forEach(renderCard);

        setTimeout(() => {
            location.reload();
        }, 500);
    };
    reader.readAsText(file);
}

// Modo oscuro y variables
const darkModeButton = document.getElementById('darkModeButton');
const body = document.body;
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
}
darkModeButton.onclick = function() {    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    }
};
darkModeButton.onclick = function() {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        darkModeButton.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode'; 
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        darkModeButton.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    }
};
