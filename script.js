document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('infoModal');
  const form = document.getElementById('moduleForm');
  let currentModuleId = '';

  // ABRIR MODAL CON BOTÓN 🛈
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const li = btn.closest('li');
      const id = li.dataset.id;

      if (!id) {
        alert('¡Falta el data-id en el li!');
        return;
      }

      currentModuleId = id;

      // Cargar datos si existen
      const data = JSON.parse(localStorage.getItem(`modinfo-${id}`)) || {};
      form.docente.value = data.docente || '';
      form.grupo.value = data.grupo || '';
      form.inicio.value = data.inicio || '';
      form.fin.value = data.fin || '';
      form.nota.value = data.nota || '';
      form.estado.value = data.estado || 'Aprobado';

      console.log('Abriendo modal para:', id);
      modal.style.display = 'block';
    });
  });

  // CERRAR MODAL
  document.querySelector('.close-btn').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // GUARDAR DATOS
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!currentModuleId) {
      alert('Error: No se ha seleccionado ningún módulo.');
      return;
    }

    const formData = {
      docente: form.docente.value,
      grupo: form.grupo.value,
      inicio: form.inicio.value,
      fin: form.fin.value,
      nota: form.nota.value,
      estado: form.estado.value
    };

    try {
      localStorage.setItem(`modinfo-${currentModuleId}`, JSON.stringify(formData));
      console.log('Guardado:', `modinfo-${currentModuleId}`, formData);
      alert('Información guardada correctamente ✅');
    } catch (err) {
      console.error('Error al guardar en localStorage', err);
      alert('❌ Error al guardar en localStorage');
    }

    modal.style.display = 'none';
  });
});
