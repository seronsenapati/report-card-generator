/**
 * Performance Charts and Graphs for Report Card Generator
 * Uses Chart.js to create visualizations of student performance
 */

// Chart configuration
let charts = {
  subjectComparison: null,
  performanceTrend: null,
  classComparison: null
};

// Performance data store
let performanceData = {
  currentStudent: {},
  classAverages: {
    physics: 65,
    chemistry: 68,
    math: 70
  },
  trends: [
    { period: 'Term 1', physics: 72, chemistry: 68, math: 75 },
    { period: 'Term 2', physics: 75, chemistry: 70, math: 78 },
    { period: 'Term 3', physics: 78, chemistry: 72, math: 80 }
  ]
};

// Initialize charts system
function initCharts() {
  // Add event listeners
  document.getElementById('generate-performance-report').addEventListener('click', generatePerformanceReport);
  
  // Initialize charts when data is available
  updateStudentData();
  initializeCharts();
}

// Update student data from the form
function updateStudentData() {
  // Get current student marks
  const physicsMarks = parseInt(document.getElementById('p-phy-mark').textContent) || 0;
  const chemistryMarks = parseInt(document.getElementById('p-chem-mark').textContent) || 0;
  const mathMarks = parseInt(document.getElementById('p-math-mark').textContent) || 0;
  
  // Update performance data
  performanceData.currentStudent = {
    name: document.getElementById('p-name').textContent,
    physics: physicsMarks,
    chemistry: chemistryMarks,
    math: mathMarks
  };
  
  // Update chart data
  updateChartData();
}

// Initialize all charts
function initializeCharts() {
  // Subject comparison chart
  const subjectCtx = document.getElementById('subjectComparisonChart').getContext('2d');
  charts.subjectComparison = new Chart(subjectCtx, {
    type: 'bar',
    data: {
      labels: ['Physics', 'Chemistry', 'Math'],
      datasets: [{
        label: 'Marks Obtained',
        data: [
          performanceData.currentStudent.physics,
          performanceData.currentStudent.chemistry,
          performanceData.currentStudent.math
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)'
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
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Subject Performance'
        }
      }
    }
  });
  
  // Class comparison chart
  const classCtx = document.getElementById('classComparisonChart').getContext('2d');
  charts.classComparison = new Chart(classCtx, {
    type: 'radar',
    data: {
      labels: ['Physics', 'Chemistry', 'Math'],
      datasets: [
        {
          label: 'Student',
          data: [
            performanceData.currentStudent.physics,
            performanceData.currentStudent.chemistry,
            performanceData.currentStudent.math
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)'
        },
        {
          label: 'Class Average',
          data: [
            performanceData.classAverages.physics,
            performanceData.classAverages.chemistry,
            performanceData.classAverages.math
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Student vs Class Average'
        }
      }
    }
  });
  
  // Performance trend chart
  const trendCtx = document.getElementById('performanceTrendChart').getContext('2d');
  charts.performanceTrend = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: performanceData.trends.map(item => item.period),
      datasets: [
        {
          label: 'Physics',
          data: performanceData.trends.map(item => item.physics),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Chemistry',
          data: performanceData.trends.map(item => item.chemistry),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Math',
          data: performanceData.trends.map(item => item.math),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Performance Over Time'
        }
      }
    }
  });
}

// Update chart data based on current student
function updateChartData() {
  if (!charts.subjectComparison || !charts.classComparison) {
    return;
  }
  
  // Update subject comparison chart
  charts.subjectComparison.data.datasets[0].data = [
    performanceData.currentStudent.physics,
    performanceData.currentStudent.chemistry,
    performanceData.currentStudent.math
  ];
  charts.subjectComparison.update();
  
  // Update class comparison chart
  charts.classComparison.data.datasets[0].data = [
    performanceData.currentStudent.physics,
    performanceData.currentStudent.chemistry,
    performanceData.currentStudent.math
  ];
  charts.classComparison.update();
}

// Generate a printable performance report with charts
function generatePerformanceReport() {
  // Create a new window for the report
  const reportWindow = window.open('', '_blank');
  
  // Get student name
  const studentName = document.getElementById('p-name').textContent;
  
  // Create report content
  reportWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Performance Report - ${studentName}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #2563eb;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .chart-container {
          margin-bottom: 30px;
        }
        .student-info {
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f8f9fa;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 0.9em;
          color: #666;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <div class="header">
        <h1>Performance Report</h1>
        <h2>${studentName}</h2>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="student-info">
        <h3>Student Information</h3>
        <table>
          <tr>
            <th>Name</th>
            <td>${document.getElementById('p-name').textContent}</td>
          </tr>
          <tr>
            <th>Class</th>
            <td>${document.getElementById('p-class').textContent}</td>
          </tr>
          <tr>
            <th>Roll No</th>
            <td>${document.getElementById('p-roll').textContent}</td>
          </tr>
          <tr>
            <th>Section</th>
            <td>${document.getElementById('p-section').textContent}</td>
          </tr>
        </table>
      </div>
      
      <h3>Subject Performance</h3>
      <div class="chart-container">
        <canvas id="subjectChart"></canvas>
      </div>
      
      <h3>Comparison with Class Average</h3>
      <div class="chart-container">
        <canvas id="comparisonChart"></canvas>
      </div>
      
      <h3>Performance Trend</h3>
      <div class="chart-container">
        <canvas id="trendChart"></canvas>
      </div>
      
      <div class="footer">
        <p>Report generated by Report Card Generator</p>
        <p> ${new Date().getFullYear()} Tetrahedron Junior Science College</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()">Print Report</button>
      </div>
      
      <script>
        // Recreate charts in the new window
        window.onload = function() {
          // Subject performance chart
          const subjectCtx = document.getElementById('subjectChart').getContext('2d');
          new Chart(subjectCtx, ${JSON.stringify(charts.subjectComparison.config)});
          
          // Class comparison chart
          const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
          new Chart(comparisonCtx, ${JSON.stringify(charts.classComparison.config)});
          
          // Performance trend chart
          const trendCtx = document.getElementById('trendChart').getContext('2d');
          new Chart(trendCtx, ${JSON.stringify(charts.performanceTrend.config)});
        };
      </script>
    </body>
    </html>
  `);
  
  reportWindow.document.close();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCharts);
