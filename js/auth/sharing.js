/**
 * Report Card Sharing System
 * Enables generating shareable links for individual report cards
 */

// Store for shared report cards
let sharedReports = [];

// Initialize sharing system
function initSharingSystem() {
  // Create sharing UI
  createSharingUI();
  
  // Load existing shared reports from localStorage
  loadSharedReports();
  
  // Add event listeners
  document.getElementById('create-share-link').addEventListener('click', showSharingModal);
  document.getElementById('create-share-link-confirm').addEventListener('click', createShareableLink);
  document.getElementById('copy-share-link').addEventListener('click', copyShareableLink);
  document.getElementById('manage-shared-links').addEventListener('click', showSharedLinksManager);
  document.getElementById('close-share-manager').addEventListener('click', hideSharedLinksManager);
  
  // Add event listeners for sharing modal options
  document.getElementById('share-with-password').addEventListener('change', function() {
    document.getElementById('share-password').disabled = !this.checked;
  });
  
  document.getElementById('share-with-expiry').addEventListener('change', function() {
    document.getElementById('share-expiry').disabled = !this.checked;
    
    // Set default expiry date to 7 days from now if enabled
    if (this.checked) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      document.getElementById('share-expiry').valueAsDate = date;
    }
  });
}

// Create the sharing UI
function createSharingUI() {
  // We don't need to create UI elements anymore since they're already in the HTML
  // Just add any additional styling or functionality needed
  
  // Add CSS for sharing
  const sharingStyle = document.createElement('style');
  sharingStyle.textContent = `
    /* Additional sharing styles that aren't in the main CSS */
    #share-link {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    /* Any additional styles needed */
  `;
  
  document.head.appendChild(sharingStyle);
}

// Show the sharing modal
function showSharingModal() {
  // Clear any existing link
  document.getElementById('share-link').value = '';
  
  // Reset options
  document.getElementById('share-with-password').checked = false;
  document.getElementById('share-password').disabled = true;
  document.getElementById('share-password').value = '';
  
  document.getElementById('share-with-expiry').checked = false;
  document.getElementById('share-expiry').disabled = true;
  document.getElementById('share-expiry').value = '';
  
  document.getElementById('share-access-level').value = 'view';
  
  // Show the modal
  document.getElementById('sharing-modal').style.display = 'flex';
}

// Load shared reports from localStorage
function loadSharedReports() {
  const savedReports = localStorage.getItem('sharedReports');
  if (savedReports) {
    try {
      sharedReports = JSON.parse(savedReports);
    } catch (e) {
      console.error('Error parsing saved reports:', e);
      sharedReports = [];
    }
  }
}

// Save shared reports to localStorage
function saveSharedReports() {
  localStorage.setItem('sharedReports', JSON.stringify(sharedReports));
}

// Create a shareable link for the current report card
function createShareableLink() {
  // Check if user is authenticated
  if (!isUserAuthenticated()) {
    alert('Please log in to share report cards.');
    return;
  }
  
  // Check if user has permission to share
  if (!hasPermission('SHARE_REPORT')) {
    alert('You do not have permission to share report cards.');
    return;
  }
  
  // Get current report card data
  const reportData = getCurrentReportData();
  
  // Generate a unique ID for this shared report
  const reportId = generateUniqueId();
  
  // Get sharing options
  const accessLevel = document.getElementById('share-access-level').value;
  
  // Check if password protection is enabled
  let password = null;
  if (document.getElementById('share-with-password').checked) {
    password = document.getElementById('share-password').value;
    if (!password) {
      alert('Please enter a password for protection.');
      return;
    }
  }
  
  // Check if expiry is enabled
  let expiryDate = null;
  if (document.getElementById('share-with-expiry').checked) {
    expiryDate = document.getElementById('share-expiry').value;
    if (!expiryDate) {
      alert('Please select an expiry date.');
      return;
    }
  }
  
  // Create the shared report object
  const sharedReport = {
    id: reportId,
    data: reportData,
    createdBy: getCurrentUser().id,
    createdAt: new Date().toISOString(),
    expiryDate: expiryDate,
    password: password,
    accessLevel: accessLevel,
    views: 0
  };
  
  // Add to shared reports
  sharedReports.push(sharedReport);
  
  // Save to localStorage
  saveSharedReports();
  
  // Generate the share link
  const shareLink = generateShareLink(reportId);
  
  // Display the share link
  document.getElementById('share-link').value = shareLink;
}

// Get current report card data
function getCurrentReportData() {
  return {
    school: document.querySelector('.i-school').value,
    name: document.querySelector('.i-name').value,
    roll: document.querySelector('.i-roll').value,
    class: document.querySelector('.i-class').value,
    section: document.querySelector('.i-sec').value,
    gender: document.querySelector('.i-gender').value,
    father: document.querySelector('.i-father').value,
    mobile: document.querySelector('.i-mob').value,
    physicsTotal: document.querySelector('.i-p-total').value,
    physicsSecured: document.querySelector('.i-p-sec').value,
    chemistryTotal: document.querySelector('.i-c-total').value,
    chemistrySecured: document.querySelector('.i-c-sec').value,
    mathTotal: document.querySelector('.i-math-total').value,
    mathSecured: document.querySelector('.i-math-sec').value,
    result: document.querySelector('.i-res').value,
    // Include template and grading settings if available
    template: document.getElementById('template-selector')?.value || 'default',
    layout: document.getElementById('layout-selector')?.value || 'standard',
    gradingSystem: window.currentGradingSystem || 'percentage'
  };
}

// Generate a unique ID
function generateUniqueId() {
  return 'r' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Generate a share link
function generateShareLink(reportId) {
  // In a real application, this would be a proper URL
  // For this demo, we'll use a pseudo-URL
  return `${window.location.origin}${window.location.pathname}?share=${reportId}`;
}

// Copy the shareable link to clipboard
function copyShareableLink() {
  const linkInput = document.getElementById('share-link');
  linkInput.select();
  document.execCommand('copy');
  
  // Show feedback
  const copyButton = document.getElementById('copy-share-link');
  const originalText = copyButton.textContent;
  copyButton.textContent = 'Copied!';
  setTimeout(() => {
    copyButton.textContent = originalText;
  }, 2000);
}

// Show the shared links manager
function showSharedLinksManager() {
  // Check if user is authenticated
  if (!isUserAuthenticated()) {
    alert('Please log in to manage shared links.');
    return;
  }
  
  // Check if user has permission to share
  if (!hasPermission('SHARE_REPORT')) {
    alert('You do not have permission to manage shared links.');
    return;
  }
  
  // Populate the shared links table
  populateSharedLinksTable();
  
  // Show the manager
  document.getElementById('shared-links-manager').style.display = 'flex';
}

// Hide the shared links manager
function hideSharedLinksManager() {
  document.getElementById('shared-links-manager').style.display = 'none';
}

// Populate the shared links table
function populateSharedLinksTable() {
  const tbody = document.getElementById('shared-links-tbody');
  tbody.innerHTML = '';
  
  // Get current user
  const currentUser = getCurrentUser();
  
  // Filter reports created by the current user
  const userReports = sharedReports.filter(report => report.createdBy === currentUser.id);
  
  if (userReports.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5" style="text-align: center;">No shared links found.</td>';
    tbody.appendChild(row);
    return;
  }
  
  // Add each report to the table
  userReports.forEach(report => {
    const row = document.createElement('tr');
    
    // Format dates
    const createdDate = new Date(report.createdAt).toLocaleDateString();
    const expiryDate = report.expiryDate ? new Date(report.expiryDate).toLocaleDateString() : 'Never';
    
    row.innerHTML = `
      <td>${report.data.name}</td>
      <td>${createdDate}</td>
      <td>${expiryDate}</td>
      <td>${report.accessLevel.charAt(0).toUpperCase() + report.accessLevel.slice(1)}</td>
      <td class="action-buttons">
        <button class="view-button" data-id="${report.id}">View</button>
        <button class="copy-button" data-id="${report.id}">Copy Link</button>
        <button class="delete-button" data-id="${report.id}">Delete</button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
  
  // Add event listeners for action buttons
  document.querySelectorAll('.view-button').forEach(button => {
    button.addEventListener('click', function() {
      const reportId = this.getAttribute('data-id');
      viewSharedReport(reportId);
    });
  });
  
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', function() {
      const reportId = this.getAttribute('data-id');
      copySharedReportLink(reportId);
    });
  });
  
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', function() {
      const reportId = this.getAttribute('data-id');
      deleteSharedReport(reportId);
    });
  });
}

// View a shared report
function viewSharedReport(reportId) {
  const report = sharedReports.find(r => r.id === reportId);
  if (!report) return;
  
  // Load the report data into the form
  document.querySelector('.i-school').value = report.data.school;
  document.querySelector('.i-name').value = report.data.name;
  document.querySelector('.i-roll').value = report.data.roll;
  document.querySelector('.i-class').value = report.data.class;
  document.querySelector('.i-sec').value = report.data.section;
  document.querySelector('.i-gender').value = report.data.gender;
  document.querySelector('.i-father').value = report.data.father;
  document.querySelector('.i-mob').value = report.data.mobile;
  document.querySelector('.i-p-total').value = report.data.physicsTotal;
  document.querySelector('.i-p-sec').value = report.data.physicsSecured;
  document.querySelector('.i-c-total').value = report.data.chemistryTotal;
  document.querySelector('.i-c-sec').value = report.data.chemistrySecured;
  document.querySelector('.i-math-total').value = report.data.mathTotal;
  document.querySelector('.i-math-sec').value = report.data.mathSecured;
  document.querySelector('.i-res').value = report.data.result;
  
  // Apply template and grading if available
  if (report.data.template && document.getElementById('template-selector')) {
    document.getElementById('template-selector').value = report.data.template;
    if (typeof applyTemplate === 'function') {
      applyTemplate(report.data.template);
    }
  }
  
  if (report.data.layout && document.getElementById('layout-selector')) {
    document.getElementById('layout-selector').value = report.data.layout;
    if (typeof applyLayout === 'function') {
      applyLayout(report.data.layout);
    }
  }
  
  if (report.data.gradingSystem && typeof setGradingSystem === 'function') {
    setGradingSystem(report.data.gradingSystem);
  }
  
  // Generate the report card
  send_data_for_print();
  
  // Increment view count
  report.views++;
  saveSharedReports();
  
  // Hide the manager
  hideSharedLinksManager();
  
  // Scroll to the report card
  document.getElementById('report-card-HTML').scrollIntoView({ behavior: 'smooth' });
}

// Copy a shared report link
function copySharedReportLink(reportId) {
  const shareLink = generateShareLink(reportId);
  
  // Create a temporary input element
  const tempInput = document.createElement('input');
  tempInput.value = shareLink;
  document.body.appendChild(tempInput);
  
  // Select and copy
  tempInput.select();
  document.execCommand('copy');
  
  // Remove the temporary input
  document.body.removeChild(tempInput);
  
  // Show feedback
  alert('Link copied to clipboard!');
}

// Delete a shared report
function deleteSharedReport(reportId) {
  if (confirm('Are you sure you want to delete this shared link? This cannot be undone.')) {
    // Remove the report from the array
    sharedReports = sharedReports.filter(report => report.id !== reportId);
    
    // Save to localStorage
    saveSharedReports();
    
    // Refresh the table
    populateSharedLinksTable();
  }
}

// Check URL for shared report ID on page load
function checkForSharedReport() {
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('share');
  
  if (shareId) {
    // Find the shared report
    const report = sharedReports.find(r => r.id === shareId);
    
    if (report) {
      // Check if expired
      if (report.expiryDate) {
        const expiry = new Date(report.expiryDate);
        const now = new Date();
        
        if (now > expiry) {
          alert('This shared report has expired.');
          return;
        }
      }
      
      // Check if password protected
      if (report.password) {
        const password = prompt('This report is password protected. Please enter the password:');
        
        if (password !== report.password) {
          alert('Incorrect password.');
          return;
        }
      }
      
      // Load the report
      viewSharedReport(shareId);
      
      // Apply access level restrictions
      if (report.accessLevel === 'view') {
        // Disable print and download buttons
        document.querySelectorAll('button[onclick^="print_report_card"]').forEach(button => {
          button.disabled = true;
        });
        
        document.querySelectorAll('button[onclick^="GenerateCard"]').forEach(button => {
          button.disabled = true;
        });
      } else if (report.accessLevel === 'print') {
        // Allow printing but disable editing
        const inputs = document.querySelectorAll('#std_input_table input, #std_input_table select');
        inputs.forEach(input => {
          input.readOnly = true;
          if (input.tagName === 'SELECT') {
            input.disabled = true;
          }
        });
      }
      // 'edit' access level allows full access
    } else {
      alert('Shared report not found.');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initSharingSystem();
  checkForSharedReport();
});
