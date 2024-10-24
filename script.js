document.getElementById('saveButton').addEventListener('click', function () {
    // Verificar si existe un destino para el archivo JSON
    let storagePath = localStorage.getItem('storagePath');

    // Si no existe un destino, pedir al usuario que lo ingrese
    if (!storagePath) {
        let pathModal = new bootstrap.Modal(document.getElementById('pathModal'));
        pathModal.show();

        document.getElementById('savePathBtn').addEventListener('click', function () {
            let inputPath = document.getElementById('storagePathInput').value;

            if (inputPath) {
                localStorage.setItem('storagePath', inputPath);
                alert(`Ruta guardada: ${inputPath}`);
                pathModal.hide();

                // Crear un JSON vacío si no existe
                if (!localStorage.getItem('cardsData')) {
                    localStorage.setItem('cardsData', JSON.stringify([]));
                    alert('Se ha creado un JSON vacío para almacenar los datos.');
                }
            } else {
                alert('Debe ingresar una ruta válida.');
            }
        });
    } else {
        alert(`El archivo será guardado en: ${storagePath}`);
    }

    // Diagnóstico: Verificar si hay datos en localStorage
    console.log('Contenido de localStorage antes de la creación del JSON:', localStorage.getItem('cardsData'));

    // Crear un JSON vacío si no existe ya en localStorage
    let cardsData = localStorage.getItem('cardsData');

    if (!cardsData) {
        // Forzar la creación del JSON vacío
        localStorage.setItem('cardsData', JSON.stringify([]));
        alert('Se ha creado un JSON vacío para almacenar los datos.');
    }

    // Diagnóstico: Verificar si se ha creado correctamente
    console.log('Contenido de localStorage después de la creación del JSON:', localStorage.getItem('cardsData'));

    // Aquí iría el código para guardar la información en el JSON más adelante
});
