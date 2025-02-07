document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const analyzeButton = document.getElementById('analyze-button');
    const imagePreview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');
    const fileLabel = document.getElementById('file-label');

    // Manejar la selección de imágenes
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            // Mostrar vista previa de la imagen
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                imagePreview.classList.remove('hidden');
                analyzeButton.classList.remove('hidden');
                fileLabel.textContent = "Cambiar imagen";
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar el análisis de la imagen
    analyzeButton.addEventListener('click', () => {
        if (imageInput.files.length === 0) {
            alert('Por favor, selecciona una imagen.');
            return;
        }

        // Obtener la imagen y preparar los datos para enviar
        const imageFile = imageInput.files[0];
        const formData = new FormData();
        formData.append('image', imageFile);

        // Mostrar el estado de carga
        loading.classList.remove('hidden');
        resultDiv.classList.add('hidden');

        fetch('http://127.0.0.1:5000/analyze-image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            // Ocultar el estado de carga
            loading.classList.add('hidden');
            
            // Devolver la descripción
            if (data.descriptions) {
                resultText.textContent = data.descriptions.join(', ');
                resultDiv.classList.remove('hidden');
            } else {
                resultText.textContent = `Error: ${data.error || 'No se pudo analizar la imagen.'}`;
                resultDiv.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loading.classList.add('hidden');
            resultText.textContent = 'Error: No se pudo conectar al servidor.';
            resultDiv.classList.remove('hidden');
        });
    });
});