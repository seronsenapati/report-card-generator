/**
 * Bulk Report Card Generation System
 * Handles importing student data from CSV/Excel and exporting multiple report cards as ZIP
 */

// Dependencies required for this functionality
// - PapaParse for CSV parsing: https://www.papaparse.com/
// - SheetJS for Excel handling: https://sheetjs.com/
// - JSZip for ZIP file creation: https://stuk.github.io/jszip/

// Store for bulk student data
let studentDataArray = [];
let processingStatus = {
  total: 0,
  processed: 0,
  successful: 0,
  failed: 0
};

// Initialize bulk processing system
function initBulkProcessing() {
  createBulkProcessingUI();
  
  // Add event listeners for file inputs
  document.getElementById('csv-import').addEventListener('change', handleFileImport);
  document.getElementById('excel-import').addEventListener('change', handleFileImport);
  
  // Add event listeners for action buttons
  document.getElementById('process-bulk-data').addEventListener('click', processBulkData);
  document.getElementById('export-all-as-zip').addEventListener('click', exportAllAsZip);
  document.getElementById('clear-bulk-data').addEventListener('click', clearBulkData);
}

// Create the bulk processing UI
function createBulkProcessingUI() {
  // Create a new section for bulk processing
  const bulkSection = document.createElement('section');
  bulkSection.id = 'bulk-processing';
  bulkSection.className = 'container-fluid';
  bulkSection.innerHTML = `
    <h3 class="text-center mt-5">Bulk Report Card Generation</h3>
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Import Student Data</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="csv-import" class="form-label">Import from CSV</label>
              <input class="form-control" type="file" id="csv-import" accept=".csv">
            </div>
            <div class="mb-3">
              <label for="excel-import" class="form-label">Import from Excel</label>
              <input class="form-control" type="file" id="excel-import" accept=".xlsx,.xls">
            </div>
            <div class="mb-3">
              <button id="process-bulk-data" class="btn btn-success">Process Data</button>
              <button id="clear-bulk-data" class="btn btn-danger">Clear Data</button>
            </div>
            <div class="mb-3">
              <a href="#" id="download-template" class="btn btn-link">Download Template</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Processing Status</h5>
          </div>
          <div class="card-body">
            <div id="processing-status">
              <p>No data imported yet.</p>
            </div>
            <div class="progress mb-3" style="display: none;">
              <div class="progress-bar" role="progressbar" style="width: 0%"></div>
            </div>
            <div id="export-actions" style="display: none;">
              <button id="export-all-as-zip" class="btn btn-primary">Export All as ZIP</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Imported Students</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped" id="student-data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Class</th>
                    <th>Physics</th>
                    <th>Chemistry</th>
                    <th>Math</th>
                    <th>Total</th>
                    <th>Result</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Student data will be inserted here -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Insert the bulk processing section at the appropriate location
  const container = document.querySelector('.container');
  
  if (container) {
    // Find a good insertion point - before the footer or at the end of the container
    const footer = container.querySelector('.footer') || container.querySelector('#contacts');
    
    if (footer && footer.parentNode === container) {
      container.insertBefore(bulkSection, footer);
    } else {
      // Just append to the end of the container
      container.appendChild(bulkSection);
    }
  } else {
    // Last resort: append to body
    document.body.appendChild(bulkSection);
  }
  
  // Initialize the download template link
  document.getElementById('download-template').addEventListener('click', function(e) {
    e.preventDefault();
    generateAndDownloadTemplate();
  });
}

// Handle file import (CSV or Excel)
function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const fileType = event.target.id === 'csv-import' ? 'csv' : 'excel';
  const statusDiv = document.getElementById('processing-status');
  
  statusDiv.innerHTML = `<p>Reading ${fileType.toUpperCase()} file...</p>`;
  
  if (fileType === 'csv') {
    // Use PapaParse to parse CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        handleImportedData(results.data);
      },
      error: function(error) {
        statusDiv.innerHTML = `<p class="text-danger">Error parsing CSV: ${error.message}</p>`;
      }
    });
  } else {
    // Use SheetJS to parse Excel
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        handleImportedData(jsonData);
      } catch (error) {
        statusDiv.innerHTML = `<p class="text-danger">Error parsing Excel: ${error.message}</p>`;
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

// Process imported data
function handleImportedData(data) {
  studentDataArray = data;
  processingStatus.total = data.length;
  processingStatus.processed = 0;
  processingStatus.successful = 0;
  processingStatus.failed = 0;
  
  updateProcessingStatus();
  populateStudentTable();
  
  // Show export actions
  document.getElementById('export-actions').style.display = 'block';
}

// Update the processing status display
function updateProcessingStatus() {
  const statusDiv = document.getElementById('processing-status');
  statusDiv.innerHTML = `
    <p><strong>Total Students:</strong> ${processingStatus.total}</p>
    <p><strong>Processed:</strong> ${processingStatus.processed}</p>
    <p><strong>Successful:</strong> ${processingStatus.successful}</p>
    <p><strong>Failed:</strong> ${processingStatus.failed}</p>
  `;
  
  // Update progress bar
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');
  
  if (processingStatus.total > 0) {
    const percentage = (processingStatus.processed / processingStatus.total) * 100;
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progress.style.display = 'flex';
  } else {
    progress.style.display = 'none';
  }
}

// Populate the student data table
function populateStudentTable() {
  const tableBody = document.querySelector('#student-data-table tbody');
  tableBody.innerHTML = '';
  
  studentDataArray.forEach((student, index) => {
    const row = document.createElement('tr');
    
    // Calculate total and result
    const physicsScore = parseFloat(student.PhysicsSecured || 0);
    const chemistryScore = parseFloat(student.ChemistrySecured || 0);
    const mathScore = parseFloat(student.MathSecured || 0);
    const totalScore = physicsScore + chemistryScore + mathScore;
    
    const physicsTotal = parseFloat(student.PhysicsTotal || 100);
    const chemistryTotal = parseFloat(student.ChemistryTotal || 100);
    const mathTotal = parseFloat(student.MathTotal || 100);
    const totalPossible = physicsTotal + chemistryTotal + mathTotal;
    
    const percentage = (totalScore / totalPossible) * 100;
    const result = percentage >= (passFailThresholds?.pass || 40) ? 'PASS' : 'FAIL';
    
    row.innerHTML = `
      <td>${student.Name || ''}</td>
      <td>${student.RollNo || ''}</td>
      <td>${student.Class || ''}</td>
      <td>${physicsScore}/${physicsTotal}</td>
      <td>${chemistryScore}/${chemistryTotal}</td>
      <td>${mathScore}/${mathTotal}</td>
      <td>${totalScore}/${totalPossible} (${percentage.toFixed(1)}%)</td>
      <td>${result}</td>
      <td>
        <button class="btn btn-sm btn-primary view-student" data-index="${index}">View</button>
        <button class="btn btn-sm btn-danger remove-student" data-index="${index}">Remove</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Add event listeners for view and remove buttons
  document.querySelectorAll('.view-student').forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      loadStudentData(studentDataArray[index]);
    });
  });
  
  document.querySelectorAll('.remove-student').forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      studentDataArray.splice(index, 1);
      processingStatus.total--;
      populateStudentTable();
      updateProcessingStatus();
    });
  });
}

// Load a student's data into the form
function loadStudentData(student) {
  // Map student data to form fields
  document.querySelector('.i-school').value = student.School || '';
  document.querySelector('.i-name').value = student.Name || '';
  document.querySelector('.i-roll').value = student.RollNo || '';
  document.querySelector('.i-class').value = student.Class || 'I';
  document.querySelector('.i-gender').value = student.Gender || 'Male';
  document.querySelector('.i-sec').value = student.Section || '';
  document.querySelector('.i-father').value = student.FatherName || '';
  document.querySelector('.i-mob').value = student.Mobile || '';
  document.querySelector('.i-p-total').value = student.PhysicsTotal || '100';
  document.querySelector('.i-p-sec').value = student.PhysicsSecured || '0';
  document.querySelector('.i-c-total').value = student.ChemistryTotal || '100';
  document.querySelector('.i-c-sec').value = student.ChemistrySecured || '0';
  document.querySelector('.i-math-total').value = student.MathTotal || '100';
  document.querySelector('.i-math-sec').value = student.MathSecured || '0';
  
  // Scroll to the form
  document.querySelector('#std_input_table').scrollIntoView({ behavior: 'smooth' });
}

// Process all student data and generate report cards
function processBulkData() {
  if (studentDataArray.length === 0) {
    alert('No student data to process. Please import data first.');
    return;
  }
  
  // Reset processing status
  processingStatus.processed = 0;
  processingStatus.successful = 0;
  processingStatus.failed = 0;
  updateProcessingStatus();
  
  // Process each student
  processNextStudent(0);
}

// Process students one by one
function processNextStudent(index) {
  if (index >= studentDataArray.length) {
    // All students processed
    alert(`Processing complete. Successfully processed ${processingStatus.successful} out of ${processingStatus.total} students.`);
    return;
  }
  
  const student = studentDataArray[index];
  
  try {
    // Load student data into form
    loadStudentData(student);
    
    // Generate report card
    send_data_for_print();
    
    // Mark as successful
    processingStatus.successful++;
  } catch (error) {
    console.error(`Error processing student ${student.Name}:`, error);
    processingStatus.failed++;
  }
  
  // Update status
  processingStatus.processed++;
  updateProcessingStatus();
  
  // Process next student with a small delay to allow UI updates
  setTimeout(() => {
    processNextStudent(index + 1);
  }, 100);
}

// Export all report cards as a ZIP file
function exportAllAsZip() {
  if (studentDataArray.length === 0) {
    alert('No student data to export. Please import and process data first.');
    return;
  }
  
  // Create a new JSZip instance
  const zip = new JSZip();
  
  // Reset processing status
  processingStatus.processed = 0;
  processingStatus.successful = 0;
  processingStatus.failed = 0;
  updateProcessingStatus();
  
  // Process each student and add to ZIP
  exportNextStudentToZip(zip, 0);
}

// Export students one by one to ZIP
function exportNextStudentToZip(zip, index) {
  if (index >= studentDataArray.length) {
    // All students processed, generate ZIP
    zip.generateAsync({ type: 'blob' })
      .then(function(content) {
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'report-cards.zip';
        link.click();
        
        alert(`Export complete. Successfully exported ${processingStatus.successful} out of ${processingStatus.total} report cards.`);
      });
    return;
  }
  
  const student = studentDataArray[index];
  
  try {
    // Load student data into form
    loadStudentData(student);
    
    // Generate report card
    send_data_for_print();
    
    // Capture report card as image
    html2canvas(document.getElementById('report-card-HTML')).then(function(canvas) {
      // Convert canvas to PNG
      const imgData = canvas.toDataURL('image/png');
      
      // Remove data URL prefix
      const base64Data = imgData.replace(/^data:image\/(png|jpg);base64,/, '');
      
      // Add to ZIP
      const fileName = `${student.Name}_${student.RollNo}.png`;
      zip.file(fileName, base64Data, { base64: true });
      
      // Also generate PDF and add to ZIP
      const pdf = new jsPDF('portrait');
      pdf.addImage(imgData, 'PNG', 10, 10);
      
      // Get PDF as base64
      const pdfData = pdf.output('datauristring');
      const pdfBase64 = pdfData.replace(/^data:application\/(pdf);base64,/, '');
      
      // Add PDF to ZIP
      const pdfFileName = `${student.Name}_${student.RollNo}.pdf`;
      zip.file(pdfFileName, pdfBase64, { base64: true });
      
      // Mark as successful
      processingStatus.successful++;
      
      // Update status
      processingStatus.processed++;
      updateProcessingStatus();
      
      // Process next student
      exportNextStudentToZip(zip, index + 1);
    });
  } catch (error) {
    console.error(`Error exporting student ${student.Name}:`, error);
    processingStatus.failed++;
    processingStatus.processed++;
    updateProcessingStatus();
    
    // Continue with next student
    exportNextStudentToZip(zip, index + 1);
  }
}

// Generate and download a template CSV file
function generateAndDownloadTemplate() {
  const headers = [
    'School', 'Name', 'RollNo', 'Class', 'Section', 'Gender', 'FatherName', 'Mobile',
    'PhysicsTotal', 'PhysicsSecured', 'ChemistryTotal', 'ChemistrySecured', 'MathTotal', 'MathSecured'
  ];
  
  // Create sample data
  const sampleData = [
    {
      'School': 'Sample School',
      'Name': 'John Doe',
      'RollNo': '12345',
      'Class': 'X',
      'Section': 'A',
      'Gender': 'Male',
      'FatherName': 'James Doe',
      'Mobile': '9876543210',
      'PhysicsTotal': '100',
      'PhysicsSecured': '85',
      'ChemistryTotal': '100',
      'ChemistrySecured': '78',
      'MathTotal': '100',
      'MathSecured': '92'
    }
  ];
  
  // Generate CSV
  const csv = Papa.unparse({
    fields: headers,
    data: sampleData
  });
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'report-card-template.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Clear all imported student data
function clearBulkData() {
  if (confirm('Are you sure you want to clear all imported student data?')) {
    studentDataArray = [];
    processingStatus.total = 0;
    processingStatus.processed = 0;
    processingStatus.successful = 0;
    processingStatus.failed = 0;
    
    updateProcessingStatus();
    populateStudentTable();
    
    document.getElementById('export-actions').style.display = 'none';
    document.getElementById('processing-status').innerHTML = '<p>No data imported yet.</p>';
    document.querySelector('.progress').style.display = 'none';
    
    // Clear file inputs
    document.getElementById('csv-import').value = '';
    document.getElementById('excel-import').value = '';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBulkProcessing);
