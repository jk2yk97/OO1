document.addEventListener('DOMContentLoaded', function () {
  const allSubjects = document.querySelectorAll('li');
  const semesters = document.querySelectorAll('.semester');

  const firstSemester = semesters[0];
  const secondSemester = semesters[1];

  const year1 = document.querySelector('.year-1');
  const year2 = document.querySelector('.year-2');

  allSubjects.forEach(li => {
    const key = li.querySelector('span').textContent.trim();
    const saved = localStorage.getItem(key);
    if (saved === 'completed') {
      li.classList.add('completed');
    }
  });

  function isCompleted(text) {
    const li = [...allSubjects].find(el => el.querySelector('span').textContent.trim() === text);
    return li && li.classList.contains('completed');
  }

  function checkUnlocking() {
    const firstSemSubjects = [...firstSemester.querySelectorAll('li')];
    const firstSemNonEnglish = firstSemSubjects.filter(li => !li.querySelector('span').textContent.includes('English'));
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
    const li = [...allSubjects].find(el => el.querySelector('span').textContent.trim() === text);
    if (li) {
      li.style.opacity = '1';
      li.style.pointerEvents = 'auto';
    }
  }

  function disableEnglish(text) {
    const li = [...allSubjects].find(el => el.querySelector('span').textContent.trim() === text);
    if (li) {
      li.style.opacity = '0.5';
      li.style.pointerEvents = 'none';
      li.classList.remove('completed');
      localStorage.removeItem(text);
    }
  }

  allSubjects.forEach(li => {
    const key = li.querySelector('span').textContent.trim();
    if ((key === 'English A2 Waystage' || key === 'English B1 Threshold') && !isCompleted(key)) {
      disableEnglish(key);
    }

    li.addEventListener('click', (e) => {
      if (e.target.closest('.info-btn')) return;

      const semester = li.closest('.semester');
      if (!semester) return;

      const isActive = semester.classList.contains('active-1') || semester.classList.contains('active-2');
      if (!isActive) return;

      const isEnglish = li.querySelector('span').textContent.includes('English');
      const text = li.querySelector('span').textContent.trim();

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

  // Date Picker Functionality
  function initializeDatePickers() {
    const datePickers = document.querySelectorAll('.date-picker');
    
    datePickers.forEach(picker => {
      const dateInput = picker.querySelector('.date-input');
      const calendarDropdown = picker.querySelector('.calendar-dropdown');
      
      let currentDate = new Date();
      let selectedDate = null;
      
      // Mostrar calendario al hacer click
      dateInput.addEventListener('click', showCalendarDropdown);
      
      function showCalendarDropdown() {
        calendarDropdown.innerHTML = generateCalendarHTML(currentDate);
        calendarDropdown.classList.add('active');
        
        // Agregar eventos a los días del calendario
        const days = calendarDropdown.querySelectorAll('.calendar-day:not(.other-month)');
        days.forEach(day => {
          day.addEventListener('click', () => selectDate(day));
        });
        
        // Agregar eventos a los controles del calendario
        const prevMonth = calendarDropdown.querySelector('.prev-month');
        const nextMonth = calendarDropdown.querySelector('.next-month');
        
        prevMonth.addEventListener('click', (e) => {
          e.stopPropagation();
          currentDate.setMonth(currentDate.getMonth() - 1);
          showCalendarDropdown();
        });
        
        nextMonth.addEventListener('click', (e) => {
          e.stopPropagation();
          currentDate.setMonth(currentDate.getMonth() + 1);
          showCalendarDropdown();
        });
      }
      
      function selectDate(dayElement) {
        const day = parseInt(dayElement.textContent);
        selectedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        
        // Formatear la fecha correctamente
        const formattedDate = formatDate(selectedDate);
        
        dateInput.value = formattedDate;
        dateInput.dataset.dateValue = selectedDate.toISOString().split('T')[0];
        calendarDropdown.classList.remove('active');
      }
      
      function formatDate(date) {
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        let formatted = date.toLocaleDateString('es', options);
        
        // Corregir el formato del día de la semana (quitar punto si existe y agregar uno al final)
        formatted = formatted.replace(/^(\w{3})\.?/, '$1.');
        
        // Reorganizar las partes para el formato deseado
        const parts = formatted.split(' ');
        return `${parts[0]} ${parts[1]} de ${parts[3]} de ${parts[5]}`;
      }
      
      function generateCalendarHTML(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const monthName = date.toLocaleString('es', { month: 'long' });
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        let html = `
          <div class="calendar-header">
            <button class="calendar-nav prev-month">←</button>
            <div class="calendar-title">${monthName} ${year}</div>
            <button class="calendar-nav next-month">→</button>
          </div>
          <div class="calendar-grid">
            <div class="calendar-day-header">Lu</div>
            <div class="calendar-day-header">Ma</div>
            <div class="calendar-day-header">Mi</div>
            <div class="calendar-day-header">Ju</div>
            <div class="calendar-day-header">Vi</div>
            <div class="calendar-day-header">Sá</div>
            <div class="calendar-day-header">Do</div>
        `;
        
        // Días del mes anterior
        const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        for (let i = firstDayOfWeek; i > 0; i--) {
          html += `<div class="calendar-day other-month">${prevMonthLastDay - i + 1}</div>`;
        }
        
        // Días del mes actual
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const current = new Date(year, month, i);
          const isSelected = selectedDate && 
                           current.getDate() === selectedDate.getDate() && 
                           current.getMonth() === selectedDate.getMonth() && 
                           current.getFullYear() === selectedDate.getFullYear();
          
          html += `<div class="calendar-day ${isSelected ? 'selected' : ''}">${i}</div>`;
        }
        
        // Días del próximo mes
        const lastDayOfWeek = lastDay.getDay() === 0 ? 0 : 7 - lastDay.getDay();
        for (let i = 1; i <= lastDayOfWeek; i++) {
          html += `<div class="calendar-day other-month">${i}</div>`;
        }
        
        html += `</div>`;
        
        return html;
      }
    });
    
    // Cerrar calendarios al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.date-picker')) {
        document.querySelectorAll('.calendar-dropdown').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
  }

  // Modal functionality
  const modal = document.getElementById('infoModal');
  const form = document.getElementById('moduleForm');
  const modalTitle = document.getElementById('modalTitle');
  const saveBtn = document.getElementById('saveBtn');
  let currentModuleId = '';

  function openModal(id, title) {
    currentModuleId = id;
    modalTitle.textContent = title;
    const data = JSON.parse(localStorage.getItem(`modinfo-${id}`)) || {};
    
    // Inicializar date pickers antes de cargar los valores
    initializeDatePickers();
    
    form.docente.value = data.docente || '';
    form.grupo.value = data.grupo || '';
    
    // Establecer valores de fecha si existen
    if (data.inicio) {
      const inicioInput = form.querySelector('input[name="inicio"]');
      const inicioDate = new Date(data.inicio);
      inicioInput.value = formatDateForDisplay(inicioDate);
      inicioInput.dataset.dateValue = data.inicio;
    }
    
    if (data.fin) {
      const finInput = form.querySelector('input[name="fin"]');
      const finDate = new Date(data.fin);
      finInput.value = formatDateForDisplay(finDate);
      finInput.dataset.dateValue = data.fin;
    }
    
    form.nota.value = data.nota || '';
    form.estado.value = data.estado || 'Aprobado';
    modal.style.display = 'block';
  }

  function formatDateForDisplay(date) {
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    let formatted = date.toLocaleDateString('es', options);
    
    // Corregir el formato del día de la semana
    formatted = formatted.replace(/^(\w{3})\.?/, '$1.');
    
    // Reorganizar las partes para el formato deseado
    const parts = formatted.split(' ');
    return `${parts[0]} ${parts[1]} de ${parts[3]} de ${parts[5]}`;
  }

  function saveFormData() {
    const data = {
      docente: form.docente.value,
      grupo: form.grupo.value,
      inicio: form.querySelector('input[name="inicio"]').dataset.dateValue || '',
      fin: form.querySelector('input[name="fin"]').dataset.dateValue || '',
      nota: form.nota.value,
      estado: form.estado.value
    };
    localStorage.setItem(`modinfo-${currentModuleId}`, JSON.stringify(data));
  }

  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const li = this.closest('li');
      const id = li.dataset.id;
      const title = li.querySelector('span').textContent.trim();
      openModal(id, title);
    });
  });

  document.querySelector('.close-btn').addEventListener('click', function() {
    modal.style.display = 'none';
  });

  saveBtn.addEventListener('click', function() {
    saveFormData();
    modal.style.display = 'none';
    alert('💟 Guardado');
  });

  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  checkUnlocking();
});
