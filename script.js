document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('infoModal');
  const form = document.getElementById('moduleForm');
  let currentModuleId = '';

  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const li = btn.closest('li');
      const id = li.dataset.id;
      if (!id) {
        alert('Falta data-id');
        return;
      }

      currentModuleId = id;

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

  document.querySelector('.close-btn').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!currentModuleId) {
      alert('No se seleccionó módulo');
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
      const li = document.querySelector(`li[data-id="${currentModuleId}"]`);
      if (formData.estado === 'Aprobado') {
        li.classList.add('completed');
      } else {
        li.classList.remove('completed');
      }
      alert('💌 Guardado');
    } catch (err) {
      console.error('Error al guardar', err);
      alert('✉ Error');
    }

    modal.style.display = 'none';
  });

  document.querySelectorAll('li[data-id]').forEach(li => {
    const id = li.dataset.id;
    const data = JSON.parse(localStorage.getItem(`modinfo-${id}`));
    if (data?.estado === 'Aprobado') {
      li.classList.add('completed');
    }
  });
});
