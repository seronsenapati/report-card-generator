/**
 * Grading System for Report Card Generator
 * Supports multiple grading scales with configurable thresholds
 */

// Grading system configurations
const gradingSystems = {
  percentage: {
    name: "Percentage",
    calculate: (score, total) => (score / total) * 100,
    format: (value) => value.toFixed(1) + "%",
    thresholds: [
      { min: 90, label: "Excellent", color: "#2ecc71" },
      { min: 80, label: "Very Good", color: "#3498db" },
      { min: 70, label: "Good", color: "#f1c40f" },
      { min: 60, label: "Satisfactory", color: "#e67e22" },
      { min: 50, label: "Pass", color: "#e74c3c" },
      { min: 0, label: "Fail", color: "#c0392b" }
    ]
  },
  
  letterGrade: {
    name: "Letter Grade",
    calculate: (score, total) => (score / total) * 100,
    format: (value) => {
      if (value >= 90) return "A+";
      if (value >= 85) return "A";
      if (value >= 80) return "A-";
      if (value >= 75) return "B+";
      if (value >= 70) return "B";
      if (value >= 65) return "B-";
      if (value >= 60) return "C+";
      if (value >= 55) return "C";
      if (value >= 50) return "C-";
      if (value >= 45) return "D+";
      if (value >= 40) return "D";
      return "F";
    },
    thresholds: [
      { min: 90, label: "A+", color: "#27ae60" },
      { min: 85, label: "A", color: "#2ecc71" },
      { min: 80, label: "A-", color: "#3498db" },
      { min: 75, label: "B+", color: "#2980b9" },
      { min: 70, label: "B", color: "#f1c40f" },
      { min: 65, label: "B-", color: "#f39c12" },
      { min: 60, label: "C+", color: "#e67e22" },
      { min: 55, label: "C", color: "#d35400" },
      { min: 50, label: "C-", color: "#e74c3c" },
      { min: 45, label: "D+", color: "#c0392b" },
      { min: 40, label: "D", color: "#a93226" },
      { min: 0, label: "F", color: "#922b21" }
    ]
  },
  
  gpa: {
    name: "GPA (4.0 Scale)",
    calculate: (score, total) => (score / total) * 100,
    format: (value) => {
      if (value >= 90) return "4.0";
      if (value >= 85) return "3.7";
      if (value >= 80) return "3.3";
      if (value >= 75) return "3.0";
      if (value >= 70) return "2.7";
      if (value >= 65) return "2.3";
      if (value >= 60) return "2.0";
      if (value >= 55) return "1.7";
      if (value >= 50) return "1.3";
      if (value >= 45) return "1.0";
      if (value >= 40) return "0.7";
      return "0.0";
    },
    thresholds: [
      { min: 90, label: "4.0", color: "#27ae60" },
      { min: 85, label: "3.7", color: "#2ecc71" },
      { min: 80, label: "3.3", color: "#3498db" },
      { min: 75, label: "3.0", color: "#2980b9" },
      { min: 70, label: "2.7", color: "#f1c40f" },
      { min: 65, label: "2.3", color: "#f39c12" },
      { min: 60, label: "2.0", color: "#e67e22" },
      { min: 55, label: "1.7", color: "#d35400" },
      { min: 50, label: "1.3", color: "#e74c3c" },
      { min: 45, label: "1.0", color: "#c0392b" },
      { min: 40, label: "0.7", color: "#a93226" },
      { min: 0, label: "0.0", color: "#922b21" }
    ]
  }
};

// Default pass/fail thresholds
let passFailThresholds = {
  pass: 40, // Minimum percentage to pass
  distinction: 75 // Minimum percentage for distinction
};

// Initialize grading system
function initGradingSystem() {
  // Create grading system selector in the form
  createGradingSystemUI();
  
  // Set default grading system
  setGradingSystem('percentage');
  
  // Add event listeners
  document.getElementById('grading-system-selector').addEventListener('change', function() {
    setGradingSystem(this.value);
  });
  
  // Add threshold change listeners
  document.getElementById('pass-threshold').addEventListener('change', function() {
    updatePassFailThresholds();
  });
  
  document.getElementById('distinction-threshold').addEventListener('change', function() {
    updatePassFailThresholds();
  });
}

// Create the grading system UI elements
function createGradingSystemUI() {
  // Create grading system selector row
  const gradingSystemRow = document.createElement('tr');
  gradingSystemRow.innerHTML = `
    <td>Grading System</td>
    <td>
      <select id="grading-system-selector" class="i-grading-system">
        ${Object.keys(gradingSystems).map(key => 
          `<option value="${key}">${gradingSystems[key].name}</option>`
        ).join('')}
      </select>
    </td>
  `;
  
  // Create pass threshold row
  const passThresholdRow = document.createElement('tr');
  passThresholdRow.innerHTML = `
    <td>Pass Threshold (%)</td>
    <td>
      <input type="number" id="pass-threshold" min="0" max="100" value="${passFailThresholds.pass}" class="i-pass-threshold">
    </td>
  `;
  
  // Create distinction threshold row
  const distinctionThresholdRow = document.createElement('tr');
  distinctionThresholdRow.innerHTML = `
    <td>Distinction Threshold (%)</td>
    <td>
      <input type="number" id="distinction-threshold" min="0" max="100" value="${passFailThresholds.distinction}" class="i-distinction-threshold">
    </td>
  `;
  
  // Insert after the layout row
  const layoutRow = document.querySelector('.i-layout')?.closest('tr') || 
                   document.querySelector('.i-gender').closest('tr');
  
  layoutRow.parentNode.insertBefore(gradingSystemRow, layoutRow.nextSibling);
  layoutRow.parentNode.insertBefore(passThresholdRow, gradingSystemRow.nextSibling);
  layoutRow.parentNode.insertBefore(distinctionThresholdRow, passThresholdRow.nextSibling);
}

// Set the active grading system
function setGradingSystem(gradingSystemKey) {
  if (!gradingSystems[gradingSystemKey]) return;
  
  // Store the selected grading system
  window.currentGradingSystem = gradingSystemKey;
  
  // Update the report card if it's visible
  if (document.getElementById('report-card-HTML').style.display !== 'none') {
    updateGrades();
  }
}

// Update pass/fail thresholds
function updatePassFailThresholds() {
  const passThreshold = parseFloat(document.getElementById('pass-threshold').value);
  const distinctionThreshold = parseFloat(document.getElementById('distinction-threshold').value);
  
  // Validate inputs
  if (!isNaN(passThreshold) && passThreshold >= 0 && passThreshold <= 100) {
    passFailThresholds.pass = passThreshold;
  }
  
  if (!isNaN(distinctionThreshold) && distinctionThreshold >= 0 && distinctionThreshold <= 100) {
    passFailThresholds.distinction = distinctionThreshold;
  }
  
  // Update the report card if it's visible
  if (document.getElementById('report-card-HTML').style.display !== 'none') {
    updateGrades();
  }
}

// Calculate and format grade based on current grading system
function calculateGrade(score, total) {
  const gradingSystem = gradingSystems[window.currentGradingSystem || 'percentage'];
  const percentage = gradingSystem.calculate(score, total);
  return {
    value: percentage,
    formatted: gradingSystem.format(percentage),
    threshold: getThreshold(percentage, gradingSystem.thresholds),
    isPassing: percentage >= passFailThresholds.pass,
    isDistinction: percentage >= passFailThresholds.distinction
  };
}

// Get the appropriate threshold for a given percentage
function getThreshold(percentage, thresholds) {
  for (const threshold of thresholds) {
    if (percentage >= threshold.min) {
      return threshold;
    }
  }
  return thresholds[thresholds.length - 1];
}

// Update all grades in the report card
function updateGrades() {
  // Get subject scores
  const physicsScore = parseFloat(std_physics_mark.value);
  const physicsTotal = parseFloat(std_p_total.value);
  const chemistryScore = parseFloat(std_chemistry_mark.value);
  const chemistryTotal = parseFloat(std_c_total.value);
  const mathScore = parseFloat(std_math_mark.value);
  const mathTotal = parseFloat(std_m_total.value);
  
  // Calculate total
  const totalScore = physicsScore + chemistryScore + mathScore;
  const totalPossible = physicsTotal + chemistryTotal + mathTotal;
  
  // Calculate overall grade
  const overallGrade = calculateGrade(totalScore, totalPossible);
  
  // Update result based on passing threshold
  document.querySelector('.i-res').value = overallGrade.isPassing ? 'PASS' : 'FAIL';
  
  // Update displayed grades
  document.querySelector('#p-percentage').innerHTML = overallGrade.formatted;
  document.querySelector('.p-percentage').innerHTML = overallGrade.formatted;
  
  // Add grade label if using letter grades or GPA
  if (window.currentGradingSystem !== 'percentage') {
    const gradeLabel = ` (${overallGrade.threshold.label})`;
    document.querySelector('#p-percentage').innerHTML += gradeLabel;
    document.querySelector('.p-percentage').innerHTML += gradeLabel;
  }
  
  // Update result with distinction if applicable
  if (overallGrade.isPassing && overallGrade.isDistinction) {
    document.querySelector('#p-result').innerHTML = 'PASS WITH DISTINCTION';
    document.querySelector('.p-result').innerHTML = 'PASS WITH DISTINCTION';
  } else {
    document.querySelector('#p-result').innerHTML = document.querySelector('.i-res').value;
    document.querySelector('.p-result').innerHTML = document.querySelector('.i-res').value;
  }
  
  // Apply color coding based on grade
  document.querySelector('#p-percentage').style.color = overallGrade.threshold.color;
  document.querySelector('.p-percentage').style.color = overallGrade.threshold.color;
}

// Get current grading settings for export
function getGradingSettings() {
  return {
    system: window.currentGradingSystem || 'percentage',
    passThreshold: passFailThresholds.pass,
    distinctionThreshold: passFailThresholds.distinction
  };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGradingSystem);
