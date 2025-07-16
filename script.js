document.addEventListener('DOMContentLoaded', function () {
  const allSubjects = document.querySelectorAll('li');
  const semesters = document.querySelectorAll('.semester');
  const firstSemester = semesters[0];
  const secondSemester = semesters[1];
  const year1 = document.querySelector('.year-1');
  const year2 = document.querySelector('.year-2');

  allSubjects.forEach(li => {
    const key = li.textContent.trim();
    const saved = localStorage.getItem(key);
    if (saved === 'completed') {
      li.classList.add('completed');
    }
  });

  function isCompleted(text) {
    const li = [...allSubjects].find(el => el.textContent.trim() === text);
    return li && li.classList.contains('completed');
  }

  function checkUnlocking() {
    const firstSemSubjects = [...firstSemester.querySelectorAll('li')];
    const firstSemNonEnglish = firstSemSubjects.filter(li => !li.textContent.includes('English'));
    const allFirstSemNonEnglishCompleted = firstSemNonEnglish.every(li => li.classList.contains('completed'));

    if (allFirstSemNonEnglishCompleted) {
      secondSemester.classList.add('active-1');
      secondSemester.classList.remove('inactive-1', 'inactive-2');
    } else {
      secondSemester.classList.add('inactive-1');
      secondSemester.classList.remove('active-1');
    }

    if (isCompleted('English A1 Breakthrough')) {
      enableEnglish('English A2 Waystage');
    } else {
      disableEnglish('English A2 Waystage');
    }
    if (isCompleted('English A2 Waystage')) {
      enableEnglish('English B1 Threshold');
    } else {
      disableEnglish('English B1 Threshold');
    }

    const firstYearSubjects = [...year1.querySelectorAll('li')];
    const allYear1Completed = firstYearSubjects.every(li => li.classList.contains('completed'));

    const secondYearSemester = year2.querySelector('.semester');

    if (allYear1Completed) {
      year2.classList.add('active');
      year2.classList.remove('inactive');
      if (secondYearSemester) {
        secondYearSemester.classList.remove('inactive-2');
        secondYearSemester.classList.add('active-2');
      }
    } else {
      year2.classList.add('inactive');
      year2.classList.remove('active');
      if (secondYearSemester) {
        secondYearSemester.classList.add('inactive-2');
        secondYearSemester.classList.remove('active-2');
      }
    }
  }

  function enableEnglish(text) {
    const li = [...allSubjects].find(el => el.textContent.trim() === text);
    if (li) {
      li.style.opacity = '1';
      li.style.pointerEvents = 'auto';
    }
  }

  function disableEnglish(text) {
    const li = [...allSubjects].find(el => el.textContent.trim() === text);
    if (li) {
      li.style.opacity = '0.5';
      li.style.pointerEvents = 'none';
      li.classList.remove('completed');
      localStorage.removeItem(text);
    }
  }

  allSubjects.forEach(li => {
    const key = li.textContent.trim();
    if ((key === 'English A2 Waystage' || key === 'English B1 Threshold') && !isCompleted(key)) {
      disableEnglish(key);
    }

    li.addEventListener('click', () => {
      const semester = li.closest('.semester');
      if (!semester) return;

      const isActive = semester.classList.contains('active-1') || semester.classList.contains('active-2');
      if (!isActive) return;

      const isEnglish = li.textContent.includes('English');
      const text = li.textContent.trim();

      if (isEnglish) {
        const canComplete =
          (text === 'English A1 Breakthrough') ||
          (text === 'English A2 Waystage' && isCompleted('English A1 Breakthrough')) ||
          (text === 'English B1 Threshold' && isCompleted('English A2 Waystage'));

        if (canComplete) {
          li.classList.toggle('completed');
          localStorage.setItem(key, li.classList.contains('completed') ? 'completed' : '');
          checkUnlocking();
        }
      } else {
        li.classList.toggle('completed');
        localStorage.setItem(key, li.classList.contains('completed') ? 'completed' : '');
        checkUnlocking();
      }
    });
  });

  checkUnlocking();

  const modal = document.getElementById('infoModal');
  const form = document.getElementById('moduleForm');
  let currentModuleId = '';

  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const li = btn.closest('li');
      const id = li.dataset.id;
      openModal(id);
    });
  });

  function openModal(id) {
    currentModuleId = id;
    const data = JSON.parse(localStorage.getItem(`modinfo-${id}`)) || {};
    form.docente.value = data.docente || '';
    form.grupo.value = data.grupo || '';
    form.inicio.value = data.inicio || '';
    form.fin.value = data.fin || '';
    form.nota.value = data.nota || '';
    form.estado.value = data.estado || 'Aprobado';
    modal.style.display = 'block';
  }

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
    if (!currentModuleId) return;

    const formData = {
      docente: form.docente.value,
      grupo: form.grupo.value,
      inicio: form.inicio.value,
      fin: form.fin.value,
      nota: form.nota.value,
      estado: form.estado.value
    };

    localStorage.setItem(`modinfo-${currentModuleId}`, JSON.stringify(formData));
    modal.style.display = 'none';
  });
});
