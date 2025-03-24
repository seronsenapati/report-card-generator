# Report Card Generator
# <img src="https://img.shields.io/badge/Status-Complete-green"> <img src="https://img.shields.io/badge/Ver-2.0.0-red">
Generate student report cards easily with advanced features including customizable templates, grading systems, performance charts, and more.

## Features

### Core Features
- Simple and intuitive UI
- Works offline after initial load
- Generate and download report cards as PDF
- Print in color or black & white

### Enhanced Features
- **Authentication System**
  - Role-based access control (Admin, Teacher, Student)
  - Secure login required to access the application
  - User registration with role selection

- **Customizable Templates**
  - Multiple design themes (Default, Modern, Elegant, Professional, Colorful)
  - Various layout options for different report card styles
  - Easy theme switching with live preview

- **Flexible Grading System**
  - Support for percentage, letter grades, and GPA
  - Configurable pass/fail thresholds
  - Automatic grade calculation based on scores

- **Dynamic Charts and Graphs**
  - Visual representation of student performance
  - Compare subject performance with interactive charts
  - Track progress over time

- **Bulk Report Generation**
  - Import student data from CSV/Excel files
  - Process multiple reports simultaneously
  - Export all reports as a single ZIP file

- **Shareable Links**
  - Generate secure links to share individual report cards
  - Password protection option for shared reports
  - Configurable access levels and expiry dates

## Technologies Used

- **Frontend**
  - HTML5
  - CSS3 with custom themes
  - JavaScript (ES6+)
  - Bootstrap 5

- **Libraries**
  - Chart.js - For data visualization
  - PapaParse - For CSV parsing
  - SheetJS - For Excel file handling
  - JSZip - For creating ZIP archives
  - html2pdf - For PDF generation

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Log in with the following default credentials:
   - Admin: username `admin`, password `admin123`
   - Teacher: username `teacher`, password `teacher123`
   - Student: username `student`, password `student123`

## Usage

1. Log in to the application
2. Fill in the student details and marks
3. Select your preferred template and grading system
4. Generate the report card
5. View, print, or download the report as needed

## Customization

- Edit `css/themes/themes.css` to modify existing themes or create new ones
- Adjust grading thresholds in `js/grading.js`
- Customize chart options in `js/charts/performance-charts.js`

## Demo

Live demo: https://subhranshuchoudhury.github.io/report-card-generator/

## License

This project is open source and available under the MIT License.

## 
## 🍫✨💖
