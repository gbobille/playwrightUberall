import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

// Specify the output file path
const outputFilePath = './extractedSteps.json';

// Check if a folder path is provided as an argument
const testDirectory = process.argv[2];
if (!testDirectory) {
  console.error('Please provide a folder path as an argument, e.g., ts-node extractSteps.ts ./tests/websites/locatorBuilder');
  process.exit(1);
}

// Recursively get all test files ending with .spec.ts in the specified directory
function getTestFiles(dir: string): string[] {
  let files: string[] = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getTestFiles(fullPath)); // Recurse into subdirectories
    } else if (fullPath.endsWith('.spec.ts')) {
      files.push(fullPath);
    }
  });
  return files;
}

function extractStepsByTestFromFile(filePath: string) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['typescript'], // Add 'jsx' if you use JSX in tests
  });

  const tests: Record<string, string[]> = {};
  let currentTestName: string | null = null;

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      
      // Detect `test.describe` function calls (for organizational purposes, not extracting steps)
      if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier' && callee.object.name === 'test' && callee.property.name === 'describe') {
        // Process `test.describe` block, but do nothing as we're only interested in `test` and `test.step`
      }
      
      // Detect `test` function calls with either single quotes or backticks
      else if (callee.type === 'Identifier' && callee.name === 'test') {
        const arg0 = path.node.arguments[0];
        if (arg0 && (arg0.type === 'StringLiteral' || arg0.type === 'TemplateLiteral')) {
          // If `StringLiteral`, directly access the `value`; if `TemplateLiteral`, join quasis to form the full string.
          currentTestName = arg0.type === 'StringLiteral' ? arg0.value : arg0.quasis.map(quasi => quasi.value.cooked).join('');
          tests[currentTestName] = [];
        }
      }

      // Detect `test.step` calls within the current test case
      else if (
        currentTestName &&
        callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'test' &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 'step'
      ) {
        const stepArg = path.node.arguments[0];
        if (stepArg && (stepArg.type === 'StringLiteral' || stepArg.type === 'TemplateLiteral')) {
          const stepText = stepArg.type === 'StringLiteral' ? stepArg.value : stepArg.quasis.map(quasi => quasi.value.cooked).join('');
          tests[currentTestName].push(stepText);
        }
      }
    },
    // Reset current test name when leaving the scope of the test function
    exit(path) {
      if (path.isCallExpression() && currentTestName && path.node.callee.type === 'Identifier' && path.node.callee.name === 'test') {
        currentTestName = null;
      }
    },
  });

  return tests;
}

function extractAllSteps() {
  const files = getTestFiles(testDirectory);
  console.log(`Total test files found: ${files.length}`);

  const stepsByFile: Record<string, Record<string, string[]>> = {};

  files.forEach((filePath) => {
    const testSteps = extractStepsByTestFromFile(filePath);
    if (Object.keys(testSteps).length > 0) {
      const file = path.relative(testDirectory, filePath); // Use relative path for each file within the specific folder
      stepsByFile[file] = testSteps;
    }
  });

  // Write the extracted steps to the output file
  fs.writeFileSync(outputFilePath, JSON.stringify(stepsByFile, null, 2), 'utf-8');
  console.log(`Extracted step names have been saved to ${outputFilePath}`);
}

extractAllSteps();
