// script.js
fetch('data.json')
  .then(res => res.json())
  .then(rawData => {
    const container = document.getElementById('notes-container');
    container.innerHTML = "";

    // Handle both formats: array OR object with "classes"
    const data = Array.isArray(rawData) ? rawData : (rawData.classes || []);

    if (!data || data.length === 0) {
      container.innerHTML = "<p>No lectures found. Please check data.json.</p>";
      return;
    }

    data.forEach(cls => {
      const classDiv = document.createElement('div');
      classDiv.classList.add('class');

      const classTitle = document.createElement('h2');
      classTitle.textContent = `Class ${cls.class || cls.name}`;
      classDiv.appendChild(classTitle);

      (cls.subjects || []).forEach(subject => {
        const subjectDiv = document.createElement('div');
        subjectDiv.classList.add('subject');

        const subjectTitle = document.createElement('h3');
        subjectTitle.textContent = subject.name;
        subjectDiv.appendChild(subjectTitle);

        (subject.chapters || []).forEach(chapter => {
          const chapterDiv = document.createElement('div');
          chapterDiv.classList.add('chapter');

          const title = document.createElement('h4');
          title.textContent = chapter.name;
          title.classList.add('chapter-title');

          // Collapsible toggle
          title.addEventListener('click', () => {
            chapterDiv.classList.toggle('collapsed');
          });

          chapterDiv.appendChild(title);

          (chapter.lectures || chapter.items || []).forEach(lec => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
              <p class="lecture-title">${lec.title}</p>
              <div class="actions">
                <a class="btn open" href="${lec.pdf || lec.path}" target="_blank">📖 Open</a>
                <a class="btn download" href="${lec.pdf || lec.path}" download>⬇ Download</a>
              </div>
            `;
            chapterDiv.appendChild(card);
          });

          subjectDiv.appendChild(chapterDiv);
        });

        classDiv.appendChild(subjectDiv);
      });

      container.appendChild(classDiv);
    });

    // 🔍 Search filter
    document.getElementById('search').addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('.lecture-title').forEach(el => {
        const card = el.closest('.card');
        card.style.display = el.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  })
  .catch(err => {
    document.getElementById('notes-container').innerHTML =
      "<p>Error loading data.json</p>";
    console.error('Error loading data.json:', err);
  });
