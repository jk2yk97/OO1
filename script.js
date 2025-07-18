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

    li.addEventListener('click', function(e) {
      if (e.target.closest('.info-btn')) {
        return;
      }

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

  function initializeDatePickers() {
    const datePickers = document.querySelectorAll('.date-picker');
    
    datePickers.forEach(picker => {
      const dateInput = picker.querySelector('.date-input');
      const calendarDropdown = picker.querySelector('.calendar-dropdown');
      
      let currentDate = new Date();
      let selectedDate = null;
      
      dateInput.addEventListener('click', function(e) {
        e.stopPropagation();
        showCalendarDropdown();
      });

      function showCalendarDropdown() {
        const rect = dateInput.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        
        calendarDropdown.innerHTML = generateCalendarHTML(currentDate);
        calendarDropdown.classList.add('active');
        
        if (spaceBelow < 300 && rect.top > 300) {
          calendarDropdown.style.top = 'auto';
          calendarDropdown.style.bottom = '100%';
          calendarDropdown.style.marginBottom = '5px';
        } else {
          calendarDropdown.style.top = '100%';
          calendarDropdown.style.bottom = 'auto';
          calendarDropdown.style.marginBottom = '0';
        }
        
        const days = calendarDropdown.querySelectorAll('.calendar-day:not(.other-month)');
        days.forEach(day => {
          day.addEventListener('click', (e) => {
            e.stopPropagation();
            selectDate(day);
          });
        });
        
        const clearBtn = calendarDropdown.querySelector('.clear-date-btn');
        clearBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          clearDate();
        });
        
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
        
        dateInput.value = formatDate(selectedDate);
        dateInput.dataset.dateValue = formatDateForStorage(selectedDate);
        calendarDropdown.classList.remove('active');
      }
      
      function clearDate() {
        dateInput.value = '';
        dateInput.removeAttribute('data-date-value');
        selectedDate = null;
        calendarDropdown.classList.remove('active');
      }
      
      function formatDate(date) {
        if (!date) return '';
        const weekday = date.toLocaleDateString('es', { weekday: 'short' }).replace('.', '');
        const day = date.getDate();
        const month = date.toLocaleDateString('es', { month: 'short' }).replace('.', '');
        const year = date.getFullYear();
        
        return `${weekday}., ${day} de ${month}. de ${year}`;
      }
      
      function formatDateForStorage(date) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      function generateCalendarHTML(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthName = date.toLocaleString('es', { month: 'long' });
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        let html = `
          <div class="calendar-header">
            <button class="calendar-nav prev-month">←</button>
            <div class="calendar-title">${monthName} ${year}</div>
            <button class="calendar-nav next-month">→</button>
          </div>
          <div class="calendar-grid">
            <div class="calendar-day-header">L</div>
            <div class="calendar-day-header">M</div>
            <div class="calendar-day-header">M</div>
            <div class="calendar-day-header">J</div>
            <div class="calendar-day-header">V</div>
            <div class="calendar-day-header">S</div>
            <div class="calendar-day-header">D</div>
        `;
        
        const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        for (let i = firstDayOfWeek; i > 0; i--) {
          html += `<div class="calendar-day other-month">${prevMonthLastDay - i + 1}</div>`;
        }
        
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const current = new Date(year, month, i);
          const isSelected = selectedDate && 
                           current.getDate() === selectedDate.getDate() && 
                           current.getMonth() === selectedDate.getMonth() && 
                           current.getFullYear() === selectedDate.getFullYear();
          
          html += `<div class="calendar-day ${isSelected ? 'selected' : ''}">${i}</div>`;
        }

        const lastDayOfWeek = lastDay.getDay() === 0 ? 0 : 7 - lastDay.getDay();
        for (let i = 1; i <= lastDayOfWeek; i++) {
          html += `<div class="calendar-day other-month">${i}</div>`;
        }
        
        html += `</div>
          <div class="calendar-actions">
            <button type="button" class="clear-date-btn">Borrar fecha</button>
          </div>`;
        
        return html;
      }
    });
    
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.date-picker')) {
        document.querySelectorAll('.calendar-dropdown').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
  }

  const modal = document.getElementById('infoModal');
  const form = document.getElementById('moduleForm');
  const modalTitle = document.getElementById('modalTitle');
  const saveBtn = document.getElementById('saveBtn');
  let currentModuleId = '';

  function openModal(id, title) {
    currentModuleId = id;
    modalTitle.textContent = title;
    const data = JSON.parse(localStorage.getItem(`modinfo-${id}`)) || {};
    
    initializeDatePickers();
    
    form.docente.value = data.docente || '';
    form.grupo.value = data.grupo || '';
    
    if (data.inicio) {
      const inicioInput = form.querySelector('input[name="inicio"]');
      inicioInput.value = formatDateForDisplay(data.inicio);
      inicioInput.dataset.dateValue = data.inicio;
    }
    
    if (data.fin) {
      const finInput = form.querySelector('input[name="fin"]');
      finInput.value = formatDateForDisplay(data.fin);
      finInput.dataset.dateValue = data.fin;
    }
    
    form.nota.value = data.nota || '';
    form.estado.value = data.estado || 'Aprobado';
    modal.style.display = 'block';
  }

  function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return '';
    
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(date.getTime())) return '';
    
    const weekday = date.toLocaleDateString('es', { weekday: 'short' }).replace('.', '');
    const day = date.getDate();
    const month = date.toLocaleDateString('es', { month: 'short' }).replace('.', '');
    const year = date.getFullYear();
    
    return `${weekday}., ${day} de ${month}. de ${year}`;
  }

  function saveFormData() {

    const notaValue = parseFloat(form.nota.value);
    if (!isNaN(notaValue)) {
      if (notaValue > 100) {
        alert('📦 La nota no puede ser mayor a 100');
        return;
      }
      if (notaValue < 0) {
        alert('📦 La nota no puede ser menor a 0');
        return;
      }
    }

    const inicioValue = form.querySelector('input[name="inicio"]').dataset.dateValue || '';
    const finValue = form.querySelector('input[name="fin"]').dataset.dateValue || '';
    
    if (finValue && !inicioValue) {
      alert('📦 Debes seleccionar una fecha de inicio si has seleccionado fecha de fin');
      return;
    }
    
    if (inicioValue) {
      const inicioParts = inicioValue.split('-');
      const inicioDate = new Date(inicioParts[0], inicioParts[1] - 1, inicioParts[2]);
      if (isNaN(inicioDate.getTime())) {
        alert('📦 La fecha de inicio no es válida');
        return;
      }
    }
    
    if (finValue) {
      const finParts = finValue.split('-');
      const finDate = new Date(finParts[0], finParts[1] - 1, finParts[2]);
      if (isNaN(finDate.getTime())) {
        alert('📦 La fecha de fin no es válida');
        return;
      }
    }
    
    const data = {
      docente: form.docente.value,
      grupo: form.grupo.value,
      inicio: inicioValue,
      fin: finValue,
      nota: form.nota.value,
      estado: form.estado.value
    };
    
    localStorage.setItem(`modinfo-${currentModuleId}`, JSON.stringify(data));
    alert('📦 Guardado correctamente');
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
  });

  document.querySelector('input[name="nota"]')?.addEventListener('input', function(e) {
    const value = parseFloat(this.value);
    if (!isNaN(value)) {
      if (value > 100) {
        this.value = 100;
      }
      if (value < 0) {
        this.value = 0;
      }
    }
  });

  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  checkUnlocking();
});
