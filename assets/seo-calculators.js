const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };

function money(value) {
  return '₹' + Math.round(value).toLocaleString('en-IN');
}

function showResult(main, sub, items = []) {
  const box = document.getElementById('result');
  const meme = document.getElementById('cgpaMeme');
  if (meme) {
    meme.classList.remove('show');
    meme.removeAttribute('src');
  }
  document.getElementById('resultMain').textContent = main;
  document.getElementById('resultSub').textContent = sub;
  document.getElementById('resultItems').innerHTML = items.map(([label, value]) => (
    `<div class="mini"><span>${label}</span><strong>${value}</strong></div>`
  )).join('');
  box.classList.add('show');
}

function addCourseRow() {
  const wrap = document.getElementById('courseRows');
  const row = document.createElement('div');
  row.className = 'dynamic-row course-row';
  row.innerHTML = `<div class="field"><label>Credits</label><select class="course-credit">
    <option value="">Select</option><option value="1">1</option><option value="1.5">1.5</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
  </select></div><div class="field"><label>Grade</label><select class="course-grade">
    <option value="">Select</option>${Object.keys(gradePoints).map(g => `<option value="${g}">${g}</option>`).join('')}
  </select></div><button class="remove" type="button" onclick="removeRow(this)">×</button>`;
  wrap.appendChild(row);
}

function addSemesterRow() {
  const wrap = document.getElementById('semesterRows');
  const count = wrap.querySelectorAll('.semester-row').length + 1;
  const row = document.createElement('div');
  row.className = 'dynamic-row semester-row';
  row.innerHTML = `<div class="field"><label>Semester ${count} GPA</label><input class="semester-gpa" type="number" min="0" max="10" step="0.01" placeholder="8.50"></div>
  <div class="field"><label>Credits</label><input class="semester-credit" type="number" min="0" step="0.5" placeholder="22"></div>
  <button class="remove" type="button" onclick="removeRow(this)">×</button>`;
  wrap.appendChild(row);
}

function removeRow(button) {
  const row = button.closest('.dynamic-row');
  const wrap = row.parentElement;
  if (wrap.querySelectorAll('.dynamic-row').length > 1) row.remove();
}

function calcGpa() {
  let credits = 0;
  let points = 0;
  document.querySelectorAll('.course-row').forEach(row => {
    const credit = Number(row.querySelector('.course-credit').value);
    const grade = row.querySelector('.course-grade').value;
    if (credit > 0 && grade in gradePoints) {
      credits += credit;
      points += credit * gradePoints[grade];
    }
  });
  if (!credits) return showResult('Check input', 'Select credits and grades for at least one course.');
  const gpa = points / credits;
  showResult(gpa.toFixed(2), 'Weighted GPA from your course credits and grades.', [
    ['Total credits', credits],
    ['Weighted grade points', points.toFixed(1)]
  ]);
}

function calcCgpa() {
  let credits = 0;
  let points = 0;
  document.querySelectorAll('.semester-row').forEach(row => {
    const gpa = Number(row.querySelector('.semester-gpa').value);
    const credit = Number(row.querySelector('.semester-credit').value);
    if (gpa >= 0 && gpa <= 10 && credit > 0) {
      credits += credit;
      points += gpa * credit;
    }
  });
  if (!credits) return showResult('Check input', 'Enter GPA and credits for at least one semester.');
  const cgpa = points / credits;
  showResult(cgpa.toFixed(2), 'Weighted CGPA across all entered semesters.', [
    ['Total credits', credits],
    ['Weighted points', points.toFixed(2)]
  ]);
  showCgpaMeme(cgpa);
}

function showCgpaMeme(score) {
  const meme = document.getElementById('cgpaMeme');
  if (!meme) return;
  let src = '../assets/memes/meme_1.png';
  if (score >= 9) src = '../assets/memes/meme_4.png';
  else if (score >= 7) src = '../assets/memes/meme_7.png';
  else if (score >= 5) src = '../assets/memes/meme_8.png';
  else src = '../assets/memes/meme_1.png';
  meme.src = src;
  meme.classList.add('show');
}

function calcPercentage() {
  const mode = document.getElementById('mode').value;
  const x = Number(document.getElementById('x').value);
  const y = Number(document.getElementById('y').value);
  if (!Number.isFinite(x) || !Number.isFinite(y) || y === 0 || (mode === 'change' && x === 0)) {
    return showResult('Check input', 'Enter valid numbers for this percentage mode.');
  }
  if (mode === 'of') return showResult((x / 100 * y).toFixed(2), `${x}% of ${y}`, [['Formula', 'X / 100 × Y']]);
  if (mode === 'is') return showResult(`${(x / y * 100).toFixed(2)}%`, `${x} is this percent of ${y}`, [['Formula', 'X / Y × 100']]);
  return showResult(`${((y - x) / x * 100).toFixed(2)}%`, `Percent change from ${x} to ${y}`, [['Formula', '(New - Old) / Old × 100']]);
}

function calcGrade() {
  const marks = Number(document.getElementById('marks').value);
  const total = Number(document.getElementById('total').value);
  if (marks < 0 || total <= 0 || marks > total) return showResult('Check input', 'Enter marks between 0 and the total marks.');
  const pct = marks / total * 100;
  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : pct >= 40 ? 'E' : 'F';
  const status = pct >= 40 ? 'Pass' : 'Needs improvement';
  showResult(`${pct.toFixed(2)}%`, `Estimated grade: ${grade}`, [
    ['Grade', grade],
    ['Status', status],
    ['Marks', `${marks}/${total}`]
  ]);
}

function calcStudyHours() {
  const subjects = Number(document.getElementById('subjects').value);
  const days = Number(document.getElementById('days').value);
  const chapters = Number(document.getElementById('chapters').value);
  const revision = Number(document.getElementById('revision').value);
  if (subjects <= 0 || days <= 0 || chapters <= 0 || revision < 0) {
    return showResult('Check input', 'Enter subjects, days, chapters and revision time.');
  }
  const total = subjects * chapters + revision;
  const daily = total / days;
  showResult(`${daily.toFixed(1)} hours/day`, 'Recommended daily study time to finish your plan.', [
    ['Total study hours', `${total.toFixed(1)} hours`],
    ['Subjects', subjects],
    ['Days available', days]
  ]);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'gpa') for (let i = 0; i < 6; i++) addCourseRow();
  if (document.body.dataset.page === 'cgpa') for (let i = 0; i < 8; i++) addSemesterRow();
});
