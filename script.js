// define our user inputs and store it in a constant.

const myForm = document.querySelector("#std_input_table");
const school_name = document.querySelector(".i-school");
const std_name = document.querySelector(".i-name");
const std_roll = document.querySelector(".i-roll");
const std_class = document.querySelector(".i-class");
const std_section = document.querySelector(".i-sec");
const std_gender = document.querySelector(".i-gender")
const std_father_name = document.querySelector(".i-father");
const std_physics_mark = document.querySelector(".i-p-sec");
const std_chemistry_mark = document.querySelector(".i-c-sec");
const std_math_mark = document.querySelector(".i-math-sec");
const std_result = document.querySelector(".i-res");
const std_mob = document.querySelector(".i-mob");
const std_p_total = document.querySelector(".i-p-total");
const std_c_total = document.querySelector(".i-c-total");
const std_m_total = document.querySelector(".i-math-total");
var total_mark_secured = 0;
var full_subject_mark = 0;
var std_percent = 0;

// Hide the card element.
document.querySelector("#report-card-HTML").style.display = "none";

// Global variables for enhanced features
let currentTemplate = 'default';
let currentLayout = 'standard';
let currentGradingSystem = 'percentage';

// Chart instances
let subjectComparisonChart;
let performanceRadarChart;
let gradeDistributionChart;

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize charts
  initCharts();
  
  // Add event listeners for the form
  document.querySelectorAll('.i-p-sec, .i-c-sec, .i-math-sec, .i-p-total, .i-c-total, .i-math-total').forEach(input => {
    input.addEventListener('input', calculateTotals);
  });
});

// Initialize charts
function initCharts() {
  // Subject Comparison Chart
  const subjectComparisonCtx = document.getElementById('subjectComparisonChart');
  if (subjectComparisonCtx) {
    subjectComparisonChart = new Chart(subjectComparisonCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Physics', 'Chemistry', 'Mathematics'],
        datasets: [{
          label: 'Subject Performance (%)',
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Percentage (%)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Subject-wise Performance'
          }
        }
      }
    });
  }

  // Performance Radar Chart
  const performanceRadarCtx = document.getElementById('performanceRadarChart');
  if (performanceRadarCtx) {
    performanceRadarChart = new Chart(performanceRadarCtx.getContext('2d'), {
      type: 'radar',
      data: {
        labels: ['Physics', 'Chemistry', 'Mathematics'],
        datasets: [{
          label: 'Performance Analysis (%)',
          data: [0, 0, 0],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Overall Performance Analysis'
          }
        }
      }
    });
  }

  // Grade Distribution Chart
  const gradeDistributionCtx = document.getElementById('gradeDistributionChart');
  if (gradeDistributionCtx) {
    gradeDistributionChart = new Chart(gradeDistributionCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Excellent (≥90%)', 'Good (75-89%)', 'Average (60-74%)', 'Below Average (<60%)'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(255, 99, 132, 0.5)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Grade Distribution'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}

// Update charts with new data
function updateCharts(physicsPercent, chemistryPercent, mathPercent) {
  // Update Subject Comparison Chart
  if (subjectComparisonChart) {
    subjectComparisonChart.data.datasets[0].data = [physicsPercent, chemistryPercent, mathPercent];
    subjectComparisonChart.update();
  }

  // Update Performance Radar Chart
  if (performanceRadarChart) {
    performanceRadarChart.data.datasets[0].data = [physicsPercent, chemistryPercent, mathPercent];
    performanceRadarChart.update();
  }

  // Update Grade Distribution Chart
  if (gradeDistributionChart) {
    // Calculate grade distribution
    const grades = [physicsPercent, chemistryPercent, mathPercent];
    const distribution = [0, 0, 0, 0];
    
    grades.forEach(grade => {
      if (grade >= 90) distribution[0]++;
      else if (grade >= 75) distribution[1]++;
      else if (grade >= 60) distribution[2]++;
      else distribution[3]++;
    });

    gradeDistributionChart.data.datasets[0].data = distribution;
    gradeDistributionChart.update();
  }
}

// Enhanced send_data_for_print function
function send_data_for_print() {
  // Get form values
  const school = document.querySelector('.i-school').value;
  const name = document.querySelector('.i-name').value;
  const roll = document.querySelector('.i-roll').value;
  const className = document.querySelector('.i-class').value;
  const section = document.querySelector('.i-sec').value;
  const gender = document.querySelector('.i-gender').value;
  const father = document.querySelector('.i-father').value;
  const mobile = document.querySelector('.i-mob').value;
  
  // Get subject marks
  const physicsTotal = parseInt(document.querySelector('.i-p-total').value) || 0;
  const physicsSecured = parseInt(document.querySelector('.i-p-sec').value) || 0;
  const chemistryTotal = parseInt(document.querySelector('.i-c-total').value) || 0;
  const chemistrySecured = parseInt(document.querySelector('.i-c-sec').value) || 0;
  const mathTotal = parseInt(document.querySelector('.i-math-total').value) || 0;
  const mathSecured = parseInt(document.querySelector('.i-math-sec').value) || 0;
  
  // Calculate totals and percentages
  const totalMarks = physicsTotal + chemistryTotal + mathTotal;
  const securedMarks = physicsSecured + chemistrySecured + mathSecured;
  const percentage = totalMarks > 0 ? ((securedMarks / totalMarks) * 100).toFixed(2) : 0;
  
  // Calculate subject percentages
  const physicsPercent = physicsTotal > 0 ? ((physicsSecured / physicsTotal) * 100).toFixed(2) : 0;
  const chemistryPercent = chemistryTotal > 0 ? ((chemistrySecured / chemistryTotal) * 100).toFixed(2) : 0;
  const mathPercent = mathTotal > 0 ? ((mathSecured / mathTotal) * 100).toFixed(2) : 0;
  
  // Get result
  const result = document.querySelector('.i-res').value;
  
  // Update the report card HTML
  document.getElementById('p-name').textContent = name;
  document.getElementById('p-roll').textContent = roll;
  document.getElementById('p-class').textContent = className;
  document.getElementById('p-section').textContent = section;
  document.getElementById('p-gender').textContent = gender;
  document.getElementById('p-father').textContent = father;
  document.getElementById('p-mobile').textContent = mobile;
  document.getElementById('p-result').textContent = result;
  
  document.getElementById('p-phy-total').textContent = physicsTotal;
  document.getElementById('p-phy-mark').textContent = physicsSecured;
  document.getElementById('p-phy-percent').textContent = physicsPercent + '%';
  
  document.getElementById('p-chem-total').textContent = chemistryTotal;
  document.getElementById('p-chem-mark').textContent = chemistrySecured;
  document.getElementById('p-chem-percent').textContent = chemistryPercent + '%';
  
  document.getElementById('p-math-total').textContent = mathTotal;
  document.getElementById('p-math-mark').textContent = mathSecured;
  document.getElementById('p-math-percent').textContent = mathPercent + '%';
  
  document.getElementById('p-total-mark').textContent = totalMarks;
  document.getElementById('p-secured-mark').textContent = securedMarks;
  document.getElementById('p-percentage').textContent = percentage + '%';
  
  // Update charts with new data
  updateCharts(parseFloat(physicsPercent), parseFloat(chemistryPercent), parseFloat(mathPercent));
  
  // Show the report card section
  document.getElementById('report-card-HTML').style.display = 'block';
}

// Calculate totals when marks are entered
function calculateTotals() {
  const physicsTotal = parseInt(document.querySelector('.i-p-total').value) || 0;
  const physicsSecured = parseInt(document.querySelector('.i-p-sec').value) || 0;
  const chemistryTotal = parseInt(document.querySelector('.i-c-total').value) || 0;
  const chemistrySecured = parseInt(document.querySelector('.i-c-sec').value) || 0;
  const mathTotal = parseInt(document.querySelector('.i-math-total').value) || 0;
  const mathSecured = parseInt(document.querySelector('.i-math-sec').value) || 0;
  
  // Calculate totals
  const totalMarks = physicsTotal + chemistryTotal + mathTotal;
  const securedMarks = physicsSecured + chemistrySecured + mathSecured;
  
  // Calculate percentage
  const percentage = totalMarks > 0 ? ((securedMarks / totalMarks) * 100).toFixed(2) : 0;
  
  // Automatically determine result based on pass threshold
  const passThreshold = 35; // 35% pass threshold
  if (percentage >= passThreshold) {
    document.querySelector('.i-res').value = 'PASS';
  } else {
    document.querySelector('.i-res').value = 'FAIL';
  }
}

// Print the report card
function print_report_card() {
  var backup_whole_body = document.body.innerHTML;
  var print_div = document.querySelector("#report-card-HTML").innerHTML;
  document.body.innerHTML = print_div;
  window.print();
  document.body.innerHTML = backup_whole_body;
}

// Generate PDF for report card
function GenerateCard() {
  // Make sure the report card is fully rendered
  send_data_for_print();
  
  // Get the element to capture
  const element = document.getElementById('report-card-HTML');
  
  // Create a clone of the element to avoid modifying the original
  const clone = element.cloneNode(true);
  clone.style.width = '210mm'; // A4 width
  clone.style.padding = '10mm';
  clone.style.backgroundColor = 'white';
  document.body.appendChild(clone);
  
  // Use html2pdf with specific settings
  const options = {
    filename: 'report-card.pdf',
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // Generate PDF
  html2pdf()
    .from(clone)
    .set(options)
    .save()
    .then(() => {
      // Remove the clone after PDF generation
      document.body.removeChild(clone);
    });
}

// Reset the form
function reset_table() {
  document.querySelector('.i-name').value = "";
  document.querySelector('.i-mob').value = "";
  document.querySelector('.i-roll').value = "";
  document.querySelector('.i-gender').value = "";
  document.querySelector('.i-math-sec').value = "";
  document.querySelector('.i-sec').value = "";
  document.querySelector('.i-p-sec').value = "";
  document.querySelector('.i-father').value = "";
  document.querySelector('.i-res').value = "";
  document.querySelector('.i-c-sec').value = "";
  document.querySelector('.i-p-total').value = "";
  document.querySelector('.i-c-total').value = "";
  document.querySelector('.i-math-total').value = "";
}
