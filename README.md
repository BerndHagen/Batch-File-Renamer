<p align="center">
  <img src="img/img_logo.png" alt="Batch File Renamer" width="128" />
</p>

<h1 align="center">Batch File Renamer</h1>

<p align="center">
  <b>A modern, browser-based batch file renaming tool with instant live preview and powerful operations.</b><br>
  <b>Drag and drop files, configure rename operations, and export all renamed files as a ZIP archive.</b>
</p>

<p align="center">
  <a href="https://github.com/BerndHagen/Batch-File-Renamer/releases"><img src="https://img.shields.io/github/v/release/BerndHagen/Batch-File-Renamer?include_prereleases&style=flat-square&color=38bdf8" alt="Latest Release"></a>&nbsp;&nbsp;<a href="https://github.com/BerndHagen/Batch-File-Renamer/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"></a>&nbsp;&nbsp;<img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React Version">&nbsp;&nbsp;<img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript" alt="TypeScript Version">&nbsp;&nbsp;<img src="https://img.shields.io/badge/Platform-Web-brightgreen?style=flat-square" alt="Platform">&nbsp;&nbsp;<img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" alt="Status">&nbsp;&nbsp;<a href="https://github.com/BerndHagen/Batch-File-Renamer/issues"><img src="https://img.shields.io/github/issues/BerndHagen/Batch-File-Renamer?style=flat-square&color=orange" alt="Open Issues"></a>
</p>

**Batch File Renamer** is a web-based file renaming tool that allows you to rename multiple files at once with instant preview. Simply drag and drop files, configure your renaming operations, and download all renamed files as a ZIP archive.

## **Key Features**

- **Drag & Drop Interface:** Drop files directly into the browser for instant processing
- **Live Preview:** See exactly how your files will be renamed before applying changes
- **Multiple Operations:** Combine operations like find/replace, numbering, case conversion, and more
- **Drag & Drop Reordering:** Reorder both files and operations via drag & drop - file order affects numbering
- **Undo/Redo:** Full undo/redo history (up to 50 states) for all operation changes
- **Smart Presets:** One-click presets for common renaming tasks
- **Custom Presets:** Save your own operation combinations with custom icons for repeated use
- **Real-time Statistics:** See total files, operations count, and files with errors at a glance
- **Premium Glass UI:** Modern, professional interface with glass morphism design
- **Batch Export:** Download all renamed files as a single ZIP archive
- **Privacy First:** All processing happens locally in your browser - files are never uploaded

## **Table of Contents**

1. [Live Demo](#live-demo)
2. [Getting Started](#getting-started)
   - [Using the Web Version](#using-the-web-version)
   - [Running Locally](#running-locally)
3. [Available Operations](#available-operations)
4. [Built-in Presets](#built-in-presets)
5. [User Guide](#user-guide)
   - [Adding Files](#adding-files)
   - [Working with Operations](#working-with-operations)
   - [Reordering Files](#reordering-files)
   - [Undo/Redo](#undoredo)
   - [Downloading Results](#downloading-results)
6. [Technical Stack](#technical-stack)
7. [Building from Source](#building-from-source)
   - [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)
10. [Screenshots](#screenshots)

## **Live Demo**

Try Batch File Renamer directly in your browser:

**[https://berndhagen.github.io/Batch-File-Renamer](https://berndhagen.github.io/Batch-File-Renamer)**

No installation or registration required.

## **Getting Started**

### **Using the Web Version**

1. Visit the [Live Demo](https://berndhagen.github.io/Batch-File-Renamer)
2. Drag and drop files into the upload zone (or click to browse)
3. Select a preset or add custom operations
4. Review the preview showing original → new names
5. Click "Download" to get a ZIP with all renamed files

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

The application will be available at `http://localhost:5173/Batch-File-Renamer/`

## **Available Operations**

Batch File Renamer provides 10 renaming operations that can be combined in any order:

| Operation | Description | Example |
|-----------|-------------|---------|
| **Find & Replace** | Replace text with optional regex support | `photo` → `image` |
| **Add Prefix** | Add text at the beginning of filenames | `file.txt` → `2024_file.txt` |
| **Add Suffix** | Add text at the end of filenames | `report` → `report_final` |
| **Change Case** | Convert case (upper, lower, title, camel, snake, kebab) | `My File` → `my_file` |
| **Numbering** | Add sequential numbers with customizable format | `song.mp3` → `001_song.mp3` |
| **Date/Time** | Insert current or file date | `photo` → `2024-01-15_photo` |
| **Trim & Clean** | Remove spaces, special characters, duplicates | `file  (1)` → `file_1` |
| **Extension** | Change, add, remove, or convert file extensions | `.JPG` → `.jpg` |
| **Remove Characters** | Remove characters by position, range, or pattern | `IMG_001` → `001` |
| **Regex** | Advanced pattern matching and replacement | Custom patterns |

Operations are applied in order from top to bottom. Drag and drop to reorder.

## **Built-in Presets**

Quick presets for common renaming tasks:

| Preset | What It Does |
|--------|--------------|
| **Number Files** | Adds sequential 3-digit numbers as prefix (001_, 002_, ...) |
| **Date Prefix** | Adds current date in YYYY-MM-DD format |
| **Clean Filenames** | Removes special chars, replaces spaces with underscores, converts to lowercase |
| **Music Files** | Adds 2-digit track numbers with " - " separator (01 - Song.mp3) |
| **Episode Format** | Adds "S01E" prefix with 2-digit episode numbers (S01E01) |
| **Lowercase All** | Converts entire filename to lowercase |
| **Replace Spaces** | Replaces all spaces with underscores |

You can also create **custom presets** by saving your current operation combination with a custom name and icon.

## **User Guide**

### **Adding Files**

- **Drag & Drop:** Drag files from your file explorer directly into the browser
- **Click to Browse:** Click the upload zone to open a file picker

All file types are supported. Files are processed locally and never uploaded to any server.

### **Working with Operations**

1. Click **"Add Operation"** to add a new operation
2. Configure the settings for each operation
3. Use the **power button** to toggle operations on/off
4. Drag the **grip handle** to reorder operations
5. Click **trash icon** to remove an operation

### **Reordering Files**

Drag files by the grip handle to change their order. This is important for numbering operations - files are numbered based on their position in the list.

### **Undo/Redo**

Full history support (up to 50 states):
- **Undo:** Click ↶ or press `Ctrl+Z`
- **Redo:** Click ↷ or press `Ctrl+Y`

### **Downloading Results**

1. Review file names in the preview (original → new)
2. Files with errors are highlighted in red
3. Click **"Download"** to create a ZIP archive
4. The ZIP contains all files with their new names

## **Technical Stack**

Built with modern web technologies:

| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI framework |
| **TypeScript 5.6** | Type-safe JavaScript |
| **Vite 6** | Fast build tool and development server |
| **Tailwind CSS** | Utility-first CSS with custom glass morphism design |
| **Zustand** | Lightweight state management with persist middleware |
| **@dnd-kit** | Modern drag & drop toolkit for React |
| **JSZip** | Client-side ZIP file generation |
| **Lucide React** | Beautiful icon library |
| **React Router** | Client-side routing for Help and License pages |

## **Building from Source**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

### **Project Structure**

```
src/
├── components/     # React components (DropZone, FileList, etc.)
├── store/          # Zustand state management
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles and Tailwind config
```

## **Contributing**

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

### **Reporting Issues**

Found a bug or have a feature request? [Open an issue](https://github.com/BerndHagen/Batch-File-Renamer/issues) with:
- Clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software for personal and commercial purposes.

## **Screenshots**

The following screenshots demonstrate the core functionality of Batch File Renamer, including the file upload interface, live rename preview, operation configuration, and duplicate detection.

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
