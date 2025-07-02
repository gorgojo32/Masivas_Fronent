# Student Management Frontend with React + TypeScript

This application is a modern frontend client built with React and TypeScript that provides a complete user interface for student management operations. The system includes responsive design, Excel import/export capabilities, data visualization, and comprehensive CRUD operations for efficient student data management.

## Features

- **Responsive Design:** Optimized for desktop, tablet, and mobile devices using Material-UI
- **Complete CRUD Operations:** Create, read, update, and delete student records with intuitive forms
- **Excel Import/Export:** Upload Excel files with student data and export current data to Excel format
- **Data Grid Visualization:** Advanced data table with sorting, filtering, and pagination
- **Real-time Validation:** Client-side form validation with comprehensive error handling
- **Progress Tracking:** Real-time upload progress indicators and status feedback
- **Modal Interfaces:** User-friendly modal dialogs for data entry and file operations
- **Error Handling:** Comprehensive error messages and user feedback system
- **Modern UI/UX:** Clean, professional interface following Material Design principles

## Technologies

- **React 18:** Modern React with hooks and functional components
- **TypeScript:** Strong typing for better development experience and code reliability
- **Material-UI (MUI):** Comprehensive React component library for consistent design
- **MUI X Data Grid:** Advanced data table component with built-in features
- **React Router v7:** Client-side routing for single-page application navigation
- **Toolpad Core:** Application shell and dashboard layout components
- **Vite:** Fast build tool and development server
- **ESLint + Prettier:** Code quality and formatting tools

## Installation

### Prerequisites

Make sure you have the following installed on your system:
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:8000` (see backend documentation)

### Required VS Code Extensions

For the best development experience, install these VS Code extensions:

**Required Extensions:**

- **ES7+ React/Redux/React-Native snippets** - React code snippets
- **TypeScript Importer** - Auto import for TypeScript
- **Auto Rename Tag** - Automatically rename paired HTML/JSX tags

**Recommended Extensions:**

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatter
- **Material Icon Theme** - Better file icons
- **Bracket Pair Colorizer** - Colorize matching brackets
- **GitLens** - Enhanced Git capabilities

### Project Setup

1. **Clone the repository and navigate to frontend directory:**
   ```bash
   git clone <repository-url>
   cd student-management-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Configuration


### API Integration

The frontend expects the backend API to be running on `http://localhost:8000`. Make sure your backend server is running before starting the frontend application.

**API Endpoints Used:**
- `GET /estudiantes` - Fetch all students
- `POST /estudiantes` - Create new student
- `PUT /estudiantes/:id` - Update student
- `DELETE /estudiantes/:id` - Delete student
- `POST /estudiantes/importar-excel` - Import from Excel
- `GET /estudiantes/exportar-excel` - Export to Excel

## Usage

### Main Features

#### **Dashboard Overview**
- Access the main dashboard at the root URL (`/`)
- Navigate to student management via the sidebar menu
- Responsive layout adapts to different screen sizes

#### **Student Management**
- **View Students:** Browse all students in an interactive data grid
- **Add Students:** Use the edit modal to add new student records
- **Edit Students:** Click the settings icon on any row to edit student details
- **Delete Students:** Click the delete icon to remove student records
- **Search & Filter:** Use the data grid's built-in search and filtering capabilities

#### **Excel Operations**

##### Import Students from Excel
1. Click "Importar Excel" button
2. Select an Excel file (.xlsx or .xls)
3. Review file information in the preview
4. Click "Subir Archivo" to process
5. Monitor upload progress
6. Review import results and any errors

##### Export Students to Excel
1. Click "Exportar Todos" button
2. File will automatically download with current date
3. Open in Excel or any spreadsheet application

### Supported Excel Format

When importing students, the system recognizes these column headers (case-insensitive):

| Spanish | English Alternatives |
|---------|---------------------|
| `nombre` | `name`, `firstname`, `first_name`, `first name` |
| `apellido` | `lastname`, `surname`, `last_name`, `last name` |
| `email` | `correo`, `mail`, `e-mail`, `correo_electronico` |
| `telefono` | `phone`, `tel`, `celular`, `mobile`, `telephone` |
| `carrera` | `career`, `program`, `programa`, `degree` |
| `semestre` | `semester`, `periodo`, `term` |
| `promedio` | `average`, `gpa`, `calificacion`, `grade`, `score` |

## Project Structure

```
MASIVAS_FRONTEND/
├──  node_modules/                     # Dependencies installed by npm/yarn
├──  public/                          # Static assets served directly
├──  src/                             # Source code directory
│   ├──  assets/                      # Static assets (images, fonts, etc.)
│   ├──  Components/                  # Reusable UI components
│   │   ├── DinamicTableEstudiantes.tsx  # Main data grid component
│   │   ├── ImportResultsDisplay.tsx     # Import results display component
│   │   └── Modal/                       # Modal dialog components
│   │       ├── ModalEstudiante.tsx      # Student edit modal
│   │       └── ModalExel.tsx            # Excel import modal
│   ├── layouts/                     # Layout components
│   │   └──dashboard.tsx            # Main dashboard layout
│   ├── pages/                       # Page components
│   │   └── Estudiantes.tsx          # Main students page
│   ├── utils/                       # Utility functions
│   │   └── execelValidation.ts      # Excel file validation utilities
│   ├── App.tsx                      # Root application component
│   ├── main.tsx                     # Application entry point
│   └── vite-env.d.ts               # Vite type definitions
├── .gitignore                       # Git ignore rules
├── index.html                       # Main HTML template
├── package-lock.json                # Exact dependency versions
├── package.json                     # Project dependencies and scripts
├── README.md                        # Project documentation
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # TypeScript config for Node.js
└── vite.config.ts                   # Vite build configuration
```

## Component Architecture

### Core Components

#### **DinamicTableEstudiantes**
- Advanced data grid with built-in pagination, sorting, and filtering
- Inline edit and delete actions for each row
- Responsive design with mobile-optimized layouts
- Integration with Material-UI X Data Grid

#### **ModalEstudiante**
- Comprehensive form for student data entry and editing
- Real-time validation with error messages
- Dynamic career selection dropdown
- Responsive form layout with proper field grouping

#### **ModalExcel**
- Drag-and-drop file selection interface
- Real-time upload progress tracking
- File validation and preview functionality
- Detailed import results display with error handling

#### **ImportResultsDisplay**
- Detailed breakdown of import operation results
- Success/failure statistics with visual indicators
- Expandable error details for troubleshooting
- User-friendly guidance and tips

### Validation & Error Handling

#### **Form Validation**
```typescript
// Student form validation rules
- nombre: Required, minimum 1 character
- apellido: Required, minimum 1 character  
- email: Required, valid email format
- telefono: Required, minimum 1 character
- carrera: Required selection from available options
- semestre: Required, integer between 1-12
- promedio: Optional, decimal between 0-10
```

#### **File Validation**
```typescript
// Excel file validation rules
- File types: .xlsx, .xls only
- Maximum size: 5MB
- MIME type verification
- Extension validation as fallback
```

## Styling & Theming

### Material-UI Theme
The application uses Material-UI's default theme with custom adaptations:

- **Color Scheme:** Blue primary with gray secondary colors
- **Typography:** Roboto font family with responsive sizing
- **Spacing:** 8px base unit following Material Design guidelines
- **Breakpoints:** Responsive design for mobile, tablet, and desktop

### Responsive Design
- **Mobile First:** Optimized for mobile devices with progressive enhancement
- **Flexible Layouts:** CSS Grid and Flexbox for adaptive layouts  
- **Touch Friendly:** Appropriately sized touch targets for mobile devices
- **Screen Readers:** Proper ARIA labels and semantic HTML

## Performance Features

### Optimization Techniques
- **Code Splitting:** Automatic route-based code splitting with React Router
- **Lazy Loading:** Components loaded on demand to reduce initial bundle size
- **Memoization:** React.memo and useMemo for preventing unnecessary re-renders
- **Virtual Scrolling:** Data grid handles large datasets efficiently
- **Image Optimization:** Proper sizing and format optimization for icons

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run preview

# Generate bundle analyzer report
npm run analyze
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Structure
```
tests/
├── components/           # Component unit tests
├── pages/               # Page integration tests
├── utils/               # Utility function tests
└── __mocks__/           # Mock files for testing
```

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors automatically
npm run format          # Format code with Prettier
npm run type-check      # Run TypeScript compiler check

# Testing
npm run test            # Run tests
npm run test:ui         # Run tests with UI
npm run coverage        # Generate test coverage report
```

### Git Workflow
```bash
# Feature development
git checkout -b feature/student-dashboard
git add .
git commit -m "feat: add student dashboard component"
git push origin feature/student-dashboard

# Create pull request for code review
```

## Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# The dist/ folder contains the production-ready files
# Deploy the contents of dist/ to your web server
```

### Environment-Specific Builds
```bash
# Development build
npm run build:dev

# Staging build  
npm run build:staging

# Production build
npm run build:prod
```

### Docker Deployment
```dockerfile
# Dockerfile for containerized deployment
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

## Browser Support

### Supported Browsers
- **Chrome:** Version 90+
- **Firefox:** Version 88+
- **Safari:** Version 14+
- **Edge:** Version 90+

### Progressive Web App Features
- **Responsive Design:** Works on all device sizes
- **Fast Loading:** Optimized bundle size and lazy loading
- **Offline Support:** Service worker for basic offline functionality
- **App-like Experience:** Full-screen mode support

## Common Issues and Solutions

### Development Issues

#### **API Connection Problems**
- **Issue:** Cannot connect to backend API
- **Solution:** Ensure backend server is running on `http://localhost:8000`
- **Check:** Verify CORS settings in backend configuration

#### **Excel Import Failures**
- **Issue:** Excel files not uploading correctly
- **Solution:** Verify file format (.xlsx/.xls) and size (<5MB)
- **Check:** Ensure column headers match expected format

#### **Build Errors**
- **Issue:** TypeScript compilation errors
- **Solution:** Run `npm run type-check` to identify type issues
- **Check:** Ensure all dependencies are properly installed

### Performance Issues

#### **Slow Data Grid Loading**
- **Issue:** Large datasets causing performance problems
- **Solution:** Implement server-side pagination in backend
- **Check:** Monitor bundle size and consider code splitting

#### **Memory Leaks**
- **Issue:** Application becomes slow over time
- **Solution:** Properly clean up useEffect hooks and event listeners
- **Check:** Use React DevTools Profiler to identify issues

## API Integration Examples

### Student CRUD Operations
```typescript
// Fetch all students
const fetchStudents = async () => {
  const response = await fetch('http://localhost:8000/estudiantes');
  const data = await response.json();
  return data.data;
};

// Create new student
const createStudent = async (student) => {
  const response = await fetch('http://localhost:8000/estudiantes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  return response.json();
};

// Update student
const updateStudent = async (id, student) => {
  const response = await fetch(`http://localhost:8000/estudiantes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  return response.json();
};

// Delete student
const deleteStudent = async (id) => {
  const response = await fetch(`http://localhost:8000/estudiantes/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};
```

### Excel Operations
```typescript
// Import from Excel
const importExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/estudiantes/importar-excel', {
    method: 'POST',
    body: formData
  });
  return response.json();
};

// Export to Excel
const exportExcel = async () => {
  const response = await fetch('http://localhost:8000/estudiantes/exportar-excel');
  const blob = await response.blob();
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'estudiantes.xlsx';
  a.click();
  window.URL.revokeObjectURL(url);
};
```

## Contributing

### Code Style Guidelines
- Use TypeScript for all new components
- Follow Material-UI design patterns
- Implement proper error handling
- Add comprehensive JSDoc comments
- Write unit tests for new features

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Run linting and type checking
4. Update documentation if needed
5. Submit pull request with detailed description

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For support and questions:
- **Documentation:** Check this README and inline code comments
- **Issues:** Create GitHub issues for bugs and feature requests
- **Development:** Follow the contributing guidelines above

---

**Note:** This frontend application requires the corresponding backend API to be running. Please refer to the backend documentation for setup instructions.
