<p align="center">
  <img src="img/img_logo.png" alt="Batch File Renamer" width="128" />
</p>

<h1 align="center">Batch File Renamer</h1>

<p align="center">
  <b>A browser-based batch renaming workspace with live preview, reusable operations, and local ZIP export.</b><br>
  <b>Import files or folders, build a rename chain, review the result, and export selected files without uploading anything.</b>
</p>

<p align="center">
  <a href="https://github.com/BerndHagen/Batch-File-Renamer/releases"><img src="https://img.shields.io/github/v/release/BerndHagen/Batch-File-Renamer?include_prereleases&style=flat-square&color=3291ff" alt="Latest Release"></a>&nbsp;&nbsp;
  <a href="https://github.com/BerndHagen/Batch-File-Renamer/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-512bd4?style=flat-square" alt="License"></a>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React Version">&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript" alt="TypeScript Version">&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Platform-Web-64748b?style=flat-square" alt="Platform">&nbsp;&nbsp;
  <a href="https://github.com/BerndHagen/Batch-File-Renamer/issues"><img src="https://img.shields.io/github/issues/BerndHagen/Batch-File-Renamer?style=flat-square&color=f59e0b" alt="Open Issues"></a>
</p>

## Overview

Batch File Renamer is a client-side web app for renaming many files at once. Files are imported into a workspace, rename operations are applied in order, and the preview updates immediately. Export creates a ZIP archive with the selected files using their preview names; the original files on your device are not modified.

## Key Features

- **Files and folders:** Import individual files, whole folders, and dropped subfolders when the browser supports directory entries.
- **Live preview:** Review original names, preview names, file sizes, and validation status before exporting.
- **Selectable files:** Choose which files participate in validation and export without removing them from the workspace.
- **Operation chain:** Combine find/replace, prefix, suffix, numbering, dates, case conversion, trimming, extension changes, and regex operations.
- **Drag-and-drop ordering:** Reorder files for numbering operations and reorder operations to control processing order.
- **Undo and redo:** Operation history supports keyboard shortcuts and toolbar controls.
- **Presets:** Use built-in quick presets or save custom operation chains.
- **Validation:** Detect invalid Windows filename characters, empty names, reserved device names, names ending in spaces or periods, excessive length, and duplicate selected output names.
- **Local export:** ZIP creation happens in the browser with `client-zip`; files are not uploaded.

## Live Demo

Try the app in your browser:

**https://berndhagen.github.io/Batch-File-Renamer**

No account or installation is required.

## Getting Started

1. Open the live demo or run the app locally.
2. Drag files or folders into the import area, or use **Import Files** / **Import Folder**.
3. Select a quick preset or add custom operations.
4. Review the preview table and deselect any files you want to skip.
5. Click **Export** to create a ZIP archive with the selected renamed files.

## Available Operations

Operations are applied from top to bottom.

| Operation | Description | Example |
| --- | --- | --- |
| **Find & Replace** | Replace matching text, optionally with regex-style matching | `photo` to `image` |
| **Add Prefix** | Add text at the beginning of filenames | `file.txt` to `2024_file.txt` |
| **Add Suffix** | Add text at the end of filenames before the extension | `report.docx` to `report_final.docx` |
| **Remove Characters** | Remove characters by count, range, specific characters, or pattern | `IMG_001.jpg` to `001.jpg` |
| **Change Case** | Convert names to uppercase, lowercase, title case, sentence case, camelCase, snake_case, or kebab-case | `My File` to `my_file` |
| **Numbering** | Add sequential numbers with start, step, padding, separator, and format controls | `song.mp3` to `001_song.mp3` |
| **Date/Time** | Add current date or file modification date | `photo.jpg` to `2026-06-01_photo.jpg` |
| **Regex** | Advanced pattern replacement | Custom patterns |
| **Trim & Clean** | Trim whitespace, collapse duplicate spaces, remove configured special characters, and optionally replace spaces | `file  (1)` to `file_1` |
| **Extension** | Lowercase, uppercase, change, add, or remove file extensions | `.JPG` to `.jpg` |

## Built-In Presets

| Preset | What It Does |
| --- | --- |
| **Number Files** | Adds sequential 3-digit numbers as a prefix |
| **Date Prefix** | Adds the current date in `YYYY-MM-DD` format |
| **Clean Filenames** | Removes configured special characters, replaces spaces, and lowercases names |
| **Music Files** | Adds 2-digit track numbers with a ` - ` separator |
| **Episode Format** | Adds an `S01E` prefix with 2-digit episode numbers |
| **Lowercase All** | Converts filenames to lowercase |
| **Replace Spaces** | Replaces spaces with underscores |

Custom presets can be saved from the current operation chain and reused later.

## File Selection And Export

The preview table includes a checkbox for every file. Selected files are included in validation and export. Deselected files remain visible but are skipped, which is useful when you want to resolve duplicates or export only part of a folder.

Export is enabled when:

- At least one selected valid file has a preview name different from its original name.
- No selected file has a validation issue.
- At least one operation is active.

When supported, the app uses the File System Access API save dialog. Otherwise it falls back to a standard browser download.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+Z` | Undo operation changes |
| `Ctrl+Y` | Redo operation changes |
| `Ctrl+Shift+Z` | Redo operation changes |

## Running Locally

```bash
git clone https://github.com/BerndHagen/Batch-File-Renamer.git
cd Batch-File-Renamer
npm install
npm run dev
```

The Vite dev server serves the app at:

```text
http://localhost:5173/Batch-File-Renamer/
```

## Scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and build for production
npm run lint      # Run ESLint
npm run preview   # Preview the production build
npm run deploy    # Deploy dist/ to GitHub Pages
```

## Technical Stack

| Technology | Purpose |
| --- | --- |
| **React 18** | Component UI |
| **TypeScript 5.6** | Type checking |
| **Vite 6** | Development server and production build |
| **Tailwind CSS** | Utility classes alongside the custom UI layer |
| **Zustand** | Workspace state, presets, preferences, and undo/redo |
| **@dnd-kit** | Accessible drag-and-drop sorting |
| **client-zip** | Browser-side ZIP generation |
| **Lucide React** | Icon set |
| **React Router** | Workspace, Help, and License routes |

## Project Structure

```text
src/
|-- components/     # React components
|-- store/          # Zustand state management and rename processing
|-- types/          # TypeScript type definitions
|-- App.tsx         # Main workspace
|-- main.tsx        # Router and app entry point
`-- index.css       # Global styles and app UI system
```

## Documentation

The app includes in-app Help and License pages. The License page mirrors the repository `LICENSE` file and the package metadata declares the same MIT license.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-change`.
3. Make your changes and run `npm run build` plus `npm run lint`.
4. Commit and push your branch.
5. Open a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the full text.

## Screenshots

The repository includes workflow screenshots in `img/` from the v1.0.0 release. They are kept as release history and should be refreshed when publishing a new visual release.
