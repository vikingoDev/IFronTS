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


// Renderizado de cards
function renderCard({ titulo, link, descripcion, thumbnail }) {
    const cardContainer = document.getElementById("cardContainer");

    const card = document.createElement("a");
    card.href = link;
    card.target = "_blank";
    card.className = "card mb-3 addCard";
    card.innerHTML = `
        <img src="${thumbnail || 'https://via.placeholder.com/150'}" alt="Thumbnail" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${titulo}</h5>
            <p class="card-text">${descripcion}</p>
        </div>
    `;
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