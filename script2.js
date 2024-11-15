// Botón de Guardar siempre usa saveOrUpdateCard
document.getElementById("saveButton").addEventListener("click", saveOrUpdateCard);

// Filleado de modal al iniciar la página y al presionar "Enter" para guardar
document.getElementById("newCardModal").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("saveButton").click();
    }
});

// Renderizado de cards
async function renderCard({ titulo, link, descripcion }) {    
    const fullLink = link.startsWith('http') ? link : `https://${link}`;
    const cardContainer = document.getElementById("cardContainer");
    const card = document.createElement("a");

    card.href = fullLink;
    card.target = "_blank";
    card.className = "card m-4 addCard";
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${titulo} (${fullLink})</h5>
            <p class="card-text">${descripcion}</p>
            <div class="card-actions">
                <button class="btn btn-warning btn-sm edit-button"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-danger btn-sm delete-button"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `;

    cardContainer.appendChild(card);

    // Editar y borrar
    card.querySelector(".edit-button").addEventListener("click", (e) => {
        e.preventDefault();
        editCard(titulo, descripcion, link, card);
    });
    card.querySelector(".delete-button").addEventListener("click", (e) => {
        e.preventDefault();
        deleteCard(titulo, card);
    });
}

// Actualización y creación de cards
function saveOrUpdateCard() {
    const titulo = document.getElementById("titulo").value;
    const link = document.getElementById("link").value;
    const descripcion = document.getElementById("descripcion").value;

    if (!titulo || !link || !descripcion) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    if (document.getElementById("saveButton").innerText === "Actualizar") {
        // Editar card existente
        const cardElement = document.getElementById("editingCard");
        cardElement.querySelector(".card-title").innerText = titulo;
        cardElement.querySelector(".card-text").innerText = descripcion;
        cardElement.href = link;

        updateLocalStorageCard(cardElement.dataset.originalTitle, { titulo, link, descripcion });

        document.getElementById("saveButton").innerText = "Guardar";
        document.getElementById("cardModalLabel").innerText = "Guardar nuevo enlace";
        cardElement.removeAttribute("id");
    } else {
        // Crear nueva card
        const newCardData = { titulo, link, descripcion };
        const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
        savedCards.push(newCardData);
        localStorage.setItem("cards", JSON.stringify(savedCards));

        renderCard(newCardData);
    }

    // Limpiar campos y cerrar modal
    document.getElementById("titulo").value = "";
    document.getElementById("link").value = "";
    document.getElementById("descripcion").value = "";
    document.querySelector("#newCardModal .btn-close").click();
}

// Editar cards
function editCard(oldTitle, oldDescription, oldLink, cardElement) {
    document.getElementById("titulo").value = oldTitle;
    document.getElementById("link").value = oldLink;
    document.getElementById("descripcion").value = oldDescription;

    document.getElementById("saveButton").innerText = "Actualizar";
    document.getElementById("cardModalLabel").innerText = "Editar enlace";
    cardElement.setAttribute("id", "editingCard");
    cardElement.dataset.originalTitle = oldTitle;
    $('#newCardModal').modal('show');
}

// Actualizar card en localStorage
function updateLocalStorageCard(oldTitle, updatedCard) {
    const cards = JSON.parse(localStorage.getItem("cards")) || [];
    const updatedCards = cards.map(card => card.titulo === oldTitle ? updatedCard : card);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
}

// Borrar card y actualizar localStorage
function deleteCard(titleToDelete, cardElement) {
    cardElement.remove();
    removeCardFromLocalStorage(titleToDelete);
}

// Remover card de localStorage
function removeCardFromLocalStorage(titleToDelete) {
    const cards = JSON.parse(localStorage.getItem("cards")) || [];
    const updatedCards = cards.filter(card => card.titulo !== titleToDelete);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
}

// Renderizar cards guardadas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    savedCards.forEach(renderCard);
});

// Vaciar localStorage (excepto el adder)
function clearLocalStorage() {
    localStorage.removeItem("cards");
    const cardContainer = document.getElementById("cardContainer");
    [...cardContainer.children].forEach(child => {
        if (!child.classList.contains("adder")) {
            cardContainer.removeChild(child);
        }
    });
    location.reload();
}
