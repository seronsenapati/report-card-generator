/**
 * Report Card Template System
 * Handles template selection, customization, and application
 */

// Template configuration
const templates = {
  default: {
    name: "Default",
    theme: "theme-default",
    layout: "layout-standard",
    description: "The classic report card design"
  },
  modern: {
    name: "Modern",
    theme: "theme-modern",
    layout: "layout-standard",
    description: "Clean, blue-based modern design"
  },
  elegant: {
    name: "Elegant",
    theme: "theme-elegant",
    layout: "layout-standard",
    description: "Purple-accented elegant design"
  },
  professional: {
    name: "Professional",
    theme: "theme-professional",
    layout: "layout-standard",
    description: "Dark, professional appearance"
  },
  colorful: {
    name: "Colorful",
    theme: "theme-colorful",
    layout: "layout-standard",
    description: "Vibrant red-based design"
  }
};

// Layout options
const layouts = {
  standard: {
    name: "Standard",
    class: "layout-standard",
    description: "Default layout"
  },
  compact: {
    name: "Compact",
    class: "layout-compact",
    description: "Condensed layout with smaller text"
  },
  expanded: {
    name: "Expanded",
    class: "layout-expanded",
    description: "Spacious layout with larger text"
  }
};

// Initialize template system
function initTemplateSystem() {
  // Create template selector in the form
  createTemplateSelector();
  
  // Set default template
  applyTemplate('default');
  
  // Add event listeners
  document.getElementById('template-selector').addEventListener('change', function() {
    applyTemplate(this.value);
  });
  
  document.getElementById('layout-selector').addEventListener('change', function() {
    applyLayout(this.value);
  });
}

// Create the template selector UI
function createTemplateSelector() {
  const templateRow = document.createElement('tr');
  templateRow.innerHTML = `
    <td>Template</td>
    <td>
      <select id="template-selector" class="i-template">
        ${Object.keys(templates).map(key => 
          `<option value="${key}">${templates[key].name}</option>`
        ).join('')}
      </select>
    </td>
  `;
  
  const layoutRow = document.createElement('tr');
  layoutRow.innerHTML = `
    <td>Layout</td>
    <td>
      <select id="layout-selector" class="i-layout">
        ${Object.keys(layouts).map(key => 
          `<option value="${key}">${layouts[key].name}</option>`
        ).join('')}
      </select>
    </td>
  `;
  
  // Insert after the gender row
  const genderRow = document.querySelector('.i-gender').closest('tr');
  genderRow.parentNode.insertBefore(templateRow, genderRow.nextSibling);
  genderRow.parentNode.insertBefore(layoutRow, templateRow.nextSibling);
}

// Apply selected template
function applyTemplate(templateKey) {
  if (!templates[templateKey]) return;
  
  const template = templates[templateKey];
  const reportCard = document.getElementById('report-card-HTML');
  const bwReportCard = document.querySelector('.table_bw-div');
  
  // Remove all theme classes
  Object.values(templates).forEach(t => {
    reportCard.classList.remove(t.theme);
    bwReportCard.classList.remove(t.theme);
  });
  
  // Add themed-report-card class if not present
  if (!reportCard.classList.contains('themed-report-card')) {
    reportCard.classList.add('themed-report-card');
    bwReportCard.classList.add('themed-report-card');
  }
  
  // Apply the selected theme
  reportCard.classList.add(template.theme);
  bwReportCard.classList.add(template.theme);
  
  // Update preview if visible
  if (reportCard.style.display !== 'none') {
    updateReportCardPreview();
  }
}

// Apply selected layout
function applyLayout(layoutKey) {
  if (!layouts[layoutKey]) return;
  
  const layout = layouts[layoutKey];
  const reportCard = document.getElementById('report-card-HTML');
  const bwReportCard = document.querySelector('.table_bw-div');
  
  // Remove all layout classes
  Object.values(layouts).forEach(l => {
    reportCard.classList.remove(l.class);
    bwReportCard.classList.remove(l.class);
  });
  
  // Apply the selected layout
  reportCard.classList.add(layout.class);
  bwReportCard.classList.add(layout.class);
  
  // Update preview if visible
  if (reportCard.style.display !== 'none') {
    updateReportCardPreview();
  }
}

// Update the report card preview with current template and layout
function updateReportCardPreview() {
  // This function can be extended to refresh any template-specific elements
  console.log('Report card preview updated with new template/layout');
}

// Export template information for PDF generation
function getTemplateSettings() {
  const templateKey = document.getElementById('template-selector').value;
  const layoutKey = document.getElementById('layout-selector').value;
  
  return {
    template: templates[templateKey],
    layout: layouts[layoutKey]
  };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTemplateSystem);
