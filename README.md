<p align="center">
  <img src="img/img_logo.png" alt="Batch File Renamer" width="128" />
</p>

<h1 align="center">Batch File Renamer</h1>

<p align="center">
  <b>A browser-based batch file renaming workspace with live preview, rule chains, presets, and local ZIP export.</b><br>
  <b>Import files or folders, build rename operations, review every result, and export selected renamed copies.</b>
</p>

<p align="center">
  <a href="https://github.com/BerndHagen/Batch-File-Renamer/releases"><img src="https://img.shields.io/github/v/release/BerndHagen/Batch-File-Renamer?include_prereleases&style=flat-square&color=3291ff" alt="Latest Release"></a>&nbsp;&nbsp;
  <a href="https://github.com/BerndHagen/Batch-File-Renamer/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-512bd4?style=flat-square" alt="License"></a>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React Version">&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript" alt="TypeScript Version">&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite Version">&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Platform-Web-64748b?style=flat-square" alt="Platform">&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" alt="Status">&nbsp;&nbsp;
  <a href="https://github.com/BerndHagen/Batch-File-Renamer/issues"><img src="https://img.shields.io/github/issues/BerndHagen/Batch-File-Renamer?style=flat-square&color=orange" alt="Open Issues"></a>
</p>

**Batch File Renamer** is a client-side web application for renaming many files at once. Files are loaded into a workspace, rename operations are applied in sequence, and a preview table shows the result before anything is exported. The app creates a ZIP archive containing renamed copies of the selected files. Your original files remain untouched.

All processing happens in the browser. Files are not uploaded to a server.

## **Key Features**

- **File and Folder Import:** Import individual files, entire folders, and dropped subfolders when supported by the browser
- **Live Rename Preview:** See original names, new names, file size, status, and validation messages before exporting
- **Selectable File Queue:** Keep files in the workspace while choosing which files are included in validation and export
- **Operation Pipeline:** Combine multiple rename operations and apply them in a predictable top-to-bottom order
- **Drag and Drop Reordering:** Reorder files for numbering operations and reorder operations for precise processing
- **Quick Presets:** Apply common rename workflows such as numbering, date prefixes, cleanup, lowercase conversion, music formatting, and episode formatting
- **Custom Presets:** Save reusable operation chains with a name, description, and icon
- **Undo and Redo:** Revert operation changes with toolbar buttons or keyboard shortcuts
- **Validation:** Detect invalid filename characters, empty names, reserved Windows device names, trailing spaces or periods, long filenames, and duplicate selected output names
- **Advanced Mode:** Reveal power-user operations such as Regex and Remove Characters
- **Local ZIP Export:** Export selected renamed files as a ZIP archive using browser-side ZIP generation
- **Responsive Interface:** Works on desktop and mobile layouts with touch-friendly controls
- **Open Source:** MIT licensed and ready for review, contribution, and reuse

## **Table of Contents**

1. [Live Demo](#live-demo)
2. [Getting Started](#getting-started)
   - [Using the Web Version](#using-the-web-version)
   - [Running Locally](#running-locally)
3. [How It Works](#how-it-works)
4. [Available Operations](#available-operations)
5. [Built-in Presets](#built-in-presets)
6. [User Guide](#user-guide)
   - [Adding Files and Folders](#adding-files-and-folders)
   - [Selecting Files](#selecting-files)
   - [Working with Operations](#working-with-operations)
   - [Reordering Files](#reordering-files)
   - [Saving Custom Presets](#saving-custom-presets)
   - [Undo and Redo](#undo-and-redo)
   - [Exporting Results](#exporting-results)
7. [Validation Rules](#validation-rules)
8. [Architecture Overview](#architecture-overview)
   - [Application Flow](#application-flow)
   - [State Management](#state-management)
   - [Rename Processing](#rename-processing)
   - [File Import](#file-import)
   - [ZIP Export](#zip-export)
9. [Technical Stack](#technical-stack)
10. [Project Structure](#project-structure)
11. [Build and Deployment](#build-and-deployment)
12. [GitHub Actions](#github-actions)
13. [Privacy and Browser Support](#privacy-and-browser-support)
14. [Troubleshooting](#troubleshooting)
15. [Contributing](#contributing)
16. [License](#license)
17. [Screenshots](#screenshots)

## **Live Demo**

Try Batch File Renamer directly in your browser:

**[https://berndhagen.github.io/Batch-File-Renamer](https://berndhagen.github.io/Batch-File-Renamer)**

No installation or registration required.

## **Getting Started**

### **Using the Web Version**

1. Visit the [Live Demo](https://berndhagen.github.io/Batch-File-Renamer)
2. Drag files or folders into the import area, or use **Import Files** / **Import Folder**
3. Select a preset or add custom operations
4. Review the preview table and file status badges
5. Deselect any files you want to skip
6. Click **Export** to create a ZIP archive with the selected renamed files

### **Running Locally**

```bash
# Clone the repository
git clone https://github.com/BerndHagen/Batch-File-Renamer.git

# Navigate to project directory
cd Batch-File-Renamer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:

```text
http://localhost:5173/Batch-File-Renamer/
```

The `/Batch-File-Renamer/` base path is intentional. It matches the GitHub Pages deployment path configured in `vite.config.ts`.

## **How It Works**

Batch File Renamer does not rename files directly on disk. Browsers do not allow arbitrary file system writes for security reasons, and this app intentionally avoids modifying source files.

Instead, the workflow is:

1. The user imports files or folders into the browser workspace
2. The app stores references to the original `File` objects in memory
3. Enabled operations are applied to each file name in order
4. The preview table shows the computed output name and validation state
5. The user exports selected valid files
6. The app creates a ZIP archive where each file entry uses the computed new name

The source files on your computer remain unchanged.

## **Available Operations**

Batch File Renamer provides 10 rename operations. Operations can be combined and reordered.

| Operation | Description | Example |
|-----------|-------------|---------|
| **Find & Replace** | Replace matching text, with optional case sensitivity, regex mode, and replace-all behavior | `photo` to `image` |
| **Add Prefix** | Add text at the beginning of the filename, optionally with a counter | `file.txt` to `2026_file.txt` |
| **Add Suffix** | Add text before the extension, optionally with a counter | `report.docx` to `report_final.docx` |
| **Remove Characters** | Remove first/last N characters, a range, specific characters, or a regex pattern | `IMG_001.jpg` to `001.jpg` |
| **Change Case** | Convert to uppercase, lowercase, title case, sentence case, camelCase, snake_case, or kebab-case | `My File` to `my_file` |
| **Numbering** | Add sequential numbers with configurable start, step, padding, separator, and format | `song.mp3` to `001_song.mp3` |
| **Date/Time** | Add the current date or file modification date as prefix, suffix, or replacement | `photo.jpg` to `2026-06-01_photo.jpg` |
| **Regex** | Advanced pattern replacement using JavaScript regular expressions | Custom patterns |
| **Trim & Clean** | Trim whitespace, collapse duplicate spaces, remove configured special characters, and optionally replace spaces | `file  (1).txt` to `file_1.txt` |
| **Extension** | Lowercase, uppercase, change, add, or remove file extensions | `.JPG` to `.jpg` |

Operations are applied to the filename stem first. Extension changes are handled separately by the Extension operation.

## **Built-in Presets**

Quick presets cover common rename jobs:

| Preset | What It Does |
|--------|--------------|
| **Number Files** | Adds sequential 3-digit numbers as a prefix |
| **Date Prefix** | Adds the current date in `YYYY-MM-DD` format |
| **Clean Filenames** | Removes configured special characters, replaces spaces, and converts names to lowercase |
| **Music Files** | Adds 2-digit track numbers with a ` - ` separator |
| **Episode Format** | Adds an `S01E` prefix with 2-digit episode numbers |
| **Lowercase All** | Converts filenames to lowercase |
| **Replace Spaces** | Replaces spaces with underscores |

Custom presets can be saved from the current operation chain and reused later.

## **User Guide**

### **Adding Files and Folders**

- **Drag and Drop:** Drag files, folders, or nested folders into the import area
- **Import Files:** Open a file picker and select one or more files
- **Import Folder:** Open a folder picker and import a directory tree when supported by the browser

Duplicate source files are ignored based on path/name, size, and last modified timestamp.

### **Selecting Files**

Every file row has a checkbox. Selected files are included in:

- queued file counts
- validation checks
- duplicate output detection
- ZIP export

Deselected files stay visible in the workspace but are skipped. This is useful when you import a large folder and only want to export part of it.

### **Working with Operations**

1. Click **Add operation** to add a new rename operation
2. Configure the operation fields
3. Use the enable toggle to temporarily skip an operation
4. Drag the operation handle to change execution order
5. Remove operations that are no longer needed
6. Use Advanced Mode to show Regex and Remove Characters operations

### **Reordering Files**

Drag files by the handle to change their order. This matters for operations that use file position, especially Numbering and counters.

### **Saving Custom Presets**

When the operation chain is useful for repeated work:

1. Build the operation chain
2. Click the save preset control in the Operations header
3. Enter a preset name and optional description
4. Choose an icon
5. Save the preset

Custom presets are stored in browser local storage through Zustand persistence.

### **Undo and Redo**

Operation changes are stored in history:

- **Undo:** Click Undo or press `Ctrl+Z`
- **Redo:** Click Redo, press `Ctrl+Y`, or press `Ctrl+Shift+Z`

The history stack is limited to 50 operation states.

### **Exporting Results**

1. Review the preview table
2. Resolve any selected file issues
3. Make sure at least one selected valid file has a changed name
4. Click **Export**
5. Save or download the generated ZIP archive

Export includes selected valid files. The files inside the ZIP use their preview names.

## **Validation Rules**

The app validates selected output names before export.

| Rule | Reason |
|------|--------|
| Invalid characters are rejected | Windows does not allow characters such as `< > : " / \ | ? *` in filenames |
| Empty names are rejected | A filename stem cannot be blank |
| Names ending in a space or period are rejected | Windows treats these names inconsistently |
| Reserved device names are rejected | Names such as `CON`, `PRN`, `AUX`, `NUL`, `COM1`, and `LPT1` are reserved |
| Names over 255 characters are rejected | Common filesystem filename length limit |
| Duplicate selected output names are rejected | Prevents ZIP entries from colliding |

Deselected files are not included in duplicate checks or export blocking.

## **Architecture Overview**

Batch File Renamer is a static React application. There is no backend service.

```text
Browser
|-- React UI
|   |-- workspace layout
|   |-- import controls
|   |-- preview table
|   |-- presets and operations
|
|-- Zustand Store
|   |-- files
|   |-- operations
|   |-- presets
|   |-- undo/redo history
|
|-- Rename Processor
|   |-- apply enabled operations
|   |-- validate output names
|   |-- detect selected duplicate names
|
`-- Export
    |-- client-zip stream/blob generation
    `-- browser save/download
```

### **Application Flow**

1. `main.tsx` mounts the React app with `HashRouter`
2. `App.tsx` renders the workspace route
3. `DropZone` imports files and folders
4. `store/index.ts` converts imported files into `FileItem` records
5. `OperationsList`, `PresetList`, and `AddOperationButton` update the operation chain
6. `processFiles()` recalculates preview names after relevant changes
7. `FileList` displays previews, selection, status, and export controls
8. `ExportButton` creates a ZIP archive from selected valid files

### **State Management**

The global Zustand store contains:

| State | Purpose |
|-------|---------|
| `files` | Imported file records with original name, new name, selection, validation, and source `File` |
| `operations` | Current rename operation chain |
| `presets` | Built-in preset definitions |
| `customPresets` | User-saved presets persisted in local storage |
| `showAdvanced` | Toggles advanced operations in the operation menu |
| `history` / `historyIndex` | Undo and redo snapshots for operation changes |

Only custom presets and the advanced-mode preference are persisted. Imported files are not persisted.

### **Rename Processing**

The rename processor:

1. Splits each filename into stem and extension
2. Applies enabled operations to the stem in order
3. Applies extension operations to the extension
4. Recombines stem and extension
5. Validates the final name
6. Performs duplicate checks among selected valid files

All processing is synchronous and local.

### **File Import**

File import supports two browser paths:

- Standard file input and drag/drop files
- Directory input and dropped folder entries through WebKit directory APIs where available

For dropped folders, the directory reader recursively walks nested entries and tags imported files with a relative path when possible. This helps avoid incorrectly treating same-named files from different folders as duplicate source files.

### **ZIP Export**

Export uses `client-zip`.

Supported export paths:

- File System Access API save picker when available
- Blob download fallback for browsers without the save picker

The generated archive name uses an ISO-style timestamp:

```text
renamed-files-YYYY-MM-DDTHH-mm-ss.zip
```

## **Technical Stack**

| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI framework |
| **TypeScript 5.6** | Type-safe application code |
| **Vite 6** | Development server and production build |
| **Tailwind CSS 3.4** | Utility classes alongside custom CSS |
| **Zustand 5** | Global state, persistence, and undo/redo history |
| **@dnd-kit** | Accessible drag and drop sorting |
| **client-zip** | Browser-side ZIP generation |
| **Lucide React** | Icon library |
| **React Router** | Workspace, Help, and License routes |
| **ESLint 9** | Static analysis |

## **Project Structure**

```text
Batch-File-Renamer/
|-- .github/
|   `-- workflows/
|       |-- deploy.yml                 # GitHub Pages deployment
|       `-- update-release.yml         # Release update automation
|-- img/                               # README and release screenshots
|-- public/
|   |-- favicon.svg
|   |-- img_icon.png
|   `-- img_logo.png
|-- src/
|   |-- components/
|   |   |-- AddOperationButton.tsx      # Operation menu
|   |   |-- DropZone.tsx                # File and folder import
|   |   |-- ExportButton.tsx            # ZIP export
|   |   |-- FileList.tsx                # Preview table and file selection
|   |   |-- HelpPage.tsx                # In-app documentation
|   |   |-- Layout.tsx                  # Header and footer
|   |   |-- LicensePage.tsx             # MIT license page
|   |   |-- OperationsList.tsx          # Operation cards and config forms
|   |   |-- PresetList.tsx              # Built-in and custom presets
|   |   |-- SavePresetModal.tsx         # Custom preset creation
|   |   `-- Tooltip.tsx                 # Portal tooltip
|   |-- store/
|   |   `-- index.ts                    # Zustand state and rename processing
|   |-- types/
|   |   `-- index.ts                    # Shared TypeScript types
|   |-- App.tsx                         # Main workspace route
|   |-- main.tsx                        # Router and React entry point
|   `-- index.css                       # Global styles and UI system
|-- index.html                          # HTML entry point
|-- package.json                        # Scripts and dependencies
|-- tailwind.config.js                  # Tailwind theme extension
|-- tsconfig*.json                      # TypeScript configuration
`-- vite.config.ts                      # Vite config and GitHub Pages base path
```

## **Build and Deployment**

### **Scripts**

```bash
# Start the development server
npm run dev

# Type-check and build for production
npm run build

# Run ESLint
npm run lint

# Preview the production build
npm run preview

# Build and deploy dist/ to GitHub Pages
npm run deploy
```

### **Production Build**

`npm run build` runs:

```bash
tsc -b && vite build
```

Build output is written to `dist/`.

### **GitHub Pages**

The app is configured for GitHub Pages with:

```ts
base: '/Batch-File-Renamer/'
```

Routing uses `HashRouter`, so direct refreshes work on static hosting.

## **GitHub Actions**

The repository includes workflow files under `.github/workflows/`:

| Workflow | Purpose |
|----------|---------|
| `deploy.yml` | Builds and deploys the app to GitHub Pages |
| `update-release.yml` | Supports release update automation |

## **Privacy and Browser Support**

### **Privacy**

- Files are processed locally in the browser
- Files are not uploaded to a server
- Original files are not modified
- Exported ZIP files contain renamed copies
- Custom presets are stored in browser local storage

### **Browser Support Notes**

| Feature | Browser Support |
|---------|-----------------|
| File import | Supported by modern browsers |
| Folder picker | Best supported in Chromium-based browsers |
| Dropped folder recursion | Uses WebKit directory entry APIs where available |
| Save file picker | Uses File System Access API where available |
| ZIP fallback download | Used when save picker is unavailable |

## **Troubleshooting**

### **Export button is disabled**

Check that:

- Files are imported
- At least one file is selected
- At least one operation is configured
- At least one selected valid file has a changed name
- No selected file has a validation issue

### **Duplicate filename warning appears**

Two or more selected files produce the same output name. Change the operation chain, reorder files if numbering is involved, or deselect files that should not be exported.

### **Folder import does not appear**

Folder import support depends on browser APIs. Chromium-based browsers provide the best support. If folder picking is not available, select files manually or drag supported folders into the import area.

### **The ZIP contains copies, not renamed originals**

This is expected. Browser apps cannot safely rename arbitrary local files in place. Batch File Renamer exports renamed copies inside a ZIP archive.

## **Contributing**

Contributions are welcome. Helpful areas include:

- Additional rename operations
- Better validation rules for more platforms
- Accessibility improvements
- Browser compatibility improvements
- Tests for rename processing
- Documentation and screenshot updates

### **Development Guidelines**

- Follow the existing component and store structure
- Keep UI changes consistent with the current workspace layout
- Add concise comments only where logic is not obvious
- Run `npm run build` and `npm run lint` before opening a pull request
- Update README and in-app Help when behavior changes

### **Pull Request Flow**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-change`
3. Make your changes
4. Run the build and lint checks
5. Commit with a clear message
6. Push your branch
7. Open a pull request

### **Reporting Issues**

Open an issue with:

- A clear description of the problem or request
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and operating system
- Screenshots or sample filenames when useful

## **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software for personal and commercial purposes, provided the license notice is included where required by the MIT License.

## **Screenshots**

The following screenshots demonstrate the core functionality of Batch File Renamer, including the file import interface, live rename preview, operation configuration, and duplicate detection.

<table>
  <tr>
    <th>Batch File Renamer - Startup Interface</th>
    <th>Batch File Renamer - File Preview</th>
  </tr>
  <tr>
    <td><a href="https://github.com/BerndHagen/Batch-File-Renamer/raw/main/img/img_v1.0.0-renamer_startup.png" target="_blank"><img src="https://github.com/BerndHagen/Batch-File-Renamer/raw/main/img/img_v1.0.0-renamer_startup.png" alt="Batch File Renamer - Startup Interface" width="450"></a></td>
    <td><a href="https://github.com/BerndHagen/Batch-File-Renamer/raw/main/img/img_v1.0.0-renamer_files.png" target="_blank"><img src="https://github.com/BerndHagen/Batch-File-Renamer/raw/main/img/img_v1.0.0-renamer_files.png" alt="Batch File Renamer - File Preview" width="450"></a></td>
  </tr>
  <tr>
    <th>Batch File Renamer - Operations Panel</th>
    <th>Batch File Renamer - Duplicate Detection</th>
  </tr>
  <tr>
    <td><a href="https://github.com/BerndHagen/Batch-File-Renamer/raw/main/img/img_v1.0.0-renamer_operation.png" target="_blank"><img src="https://github.com/BerndHagen/Batch-File-Renamer/raw/main/img/img_v1.0.0-renamer_operation.png" alt="Batch File Renamer - Operations Panel" width="450"></a></td>
    <td><a href="https://github.com/BerndHagen/Batch-File-Renamer/raw/main/img/img_v1.0.0-renamer_duplicate.png" target="_blank"><img src="https://github.com/BerndHagen/Batch-File-Renamer/raw/main/img/img_v1.0.0-renamer_duplicate.png" alt="Batch File Renamer - Duplicate Detection" width="450"></a></td>
  </tr>
</table>
