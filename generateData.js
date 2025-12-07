const fs = require('fs');
const path = require('path');

const baseDir = './pdfs'; // root folder

function buildData() {
  let data = [];

  // Loop through classes
  const classes = fs.readdirSync(baseDir).filter(cls =>
    fs.statSync(path.join(baseDir, cls)).isDirectory()
  );

  classes.forEach(cls => {
    const classPath = path.join(baseDir, cls);

    // Loop through subjects/teachers
    const subjects = fs.readdirSync(classPath).filter(sub =>
      fs.statSync(path.join(classPath, sub)).isDirectory()
    );

    const subjectArray = subjects.map(subject => {
      const subjectPath = path.join(classPath, subject);

      // Loop through chapters
      const chapters = fs.readdirSync(subjectPath).filter(chap =>
        fs.statSync(path.join(subjectPath, chap)).isDirectory()
      );

      const chapterArray = chapters.map(chap => {
        const notesPath = path.join(subjectPath, chap, 'NOTES');
        let lectures = [];

        if (fs.existsSync(notesPath)) {
          const files = fs.readdirSync(notesPath).filter(f => f.endsWith('.pdf'));
          lectures = files.map(file => ({
            title: path.basename(file, '.pdf'),
            pdf: `pdfs/${cls}/${subject}/${chap}/NOTES/${file}`
          }));
        }

        return {
          name: chap.replace(/-/g, ' '), // clean name
          lectures
        };
      });

      return {
        name: subject.replace(/-/g, ' '),
        chapters: chapterArray
      };
    });

    data.push({
      class: cls.replace(/-/g, ' '),
      subjects: subjectArray
    });
  });

  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  console.log('✅ data.json generated successfully!');
}

buildData();
