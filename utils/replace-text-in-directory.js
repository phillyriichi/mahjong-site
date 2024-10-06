import fs from 'fs';
import path from 'path';

/**
 * Recursively search and replace text in all files of a directory
 * @param {string} dir - The directory to search
 * @param {string | RegExp} searchValue - The string or regular expression to search for
 * @param {string} replaceValue - The replacement string
 * @param {string} fileNameIncludes - Basic substring for file name check
 */
export const replaceTextInDirectory = (dir, searchValue, replaceValue, fileNameIncludes = 'html') => {
  // Read all files and directories within the current directory
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    // Loop through each item in the directory
    files.forEach(file => {
      const fullPath = path.join(dir, file.name);

      // Check if it's a directory
      if (file.isDirectory()) {
        // If it's a directory, recursively process the files within it
        replaceTextInDirectory(fullPath, searchValue, replaceValue);
      } else if (file.isFile() && file.name.includes(fileNameIncludes)) {
        // If it's a file, read and process it
        fs.readFile(fullPath, 'utf8', (err, data) => {
          if (err) throw err;

          // Replace text in the file's content
          const updatedContent = data.replaceAll(searchValue, replaceValue);

          // Write the updated content back to the file
          fs.writeFile(fullPath, updatedContent, 'utf8', err => {
            if (err) throw err;
          });
        });
      }
    });
  });
}