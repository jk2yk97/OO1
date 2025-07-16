document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('infoModal');
  const form = document.getElementById('moduleForm');
  let currentModuleId = '';

  // Función para formatear fecha en español dd de mes de aaaa
  function formatearFechaES(fechaISO) {
    if (!fechaISO) return '';
    const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
  }

  // Mostrar fechas formateadas con condiciones para evitar coma sola
  function mostrarFechas(inicio, fin) {
    const fInicio = formatearFechaES(inicio);
    const fFin = formatearFechaES(fin);

    if (fInicio && fFin) return `, del ${fInicio} al ${fFin}`;
    if (fInicio) return `, desde ${fInicio}`;
    if (fFin) return `, hasta ${fFin}`;
    return '';
  }

  // Actualizar la info visual debajo del nombre del módulo
  function actualizarInfoModulos() {
    document.querySelectorAll('li[data-id]').forEach(li => {
      const id = li.dataset.id;
      const data = JSON.parse(localStorage.getItem(`modinfo-${id}`)) || {};
      const infoDiv = li.querySelector('.module-info');

      const fechas = mostrarFechas(data.inicio, data.fin);
      const estado = data.estado ? ` - Estado: ${data.estado}` : '';
      const nota = data.nota ? ` - Nota: ${data.nota}` : '';
      const docente = data.docente ? `Docente: ${data.docente}` : '';

      // Concatenar solo lo que exista, sin espacios extra
      let texto = docente;
      if (fechas) texto += fechas;
      if (estado) texto += estado;
      if (nota) texto += nota;

      infoDiv.textContent = texto;
    });
  }

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

  // GUARDAR DATOS DEL FORMULARIO
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!currentModuleId) {
      alert('Error: No se ha seleccionado ningún módulo.');
      return;
    }

    const formData = {
      docente: form.docente.value.trim(),
      grupo: form.grupo.value.trim(),
      inicio: form.inicio.value,
      fin: form.fin.value,
      nota: form.nota.value.trim(),
      estado: form.estado.value
    };

    try {
      localStorage.setItem(`modinfo-${currentModuleId}`, JSON.stringify(formData));
      alert('💟 Guardado');
    } catch (err) {
      console.error('Error al guardar en localStorage', err);
      alert('💟 Error');
    }

    actualizarInfoModulos();
    modal.style.display = 'none';
  });

  actualizarInfoModulos();
});
