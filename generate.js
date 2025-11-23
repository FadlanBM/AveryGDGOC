const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName || moduleName === '--help' || moduleName === '-h') {
  process.exit(moduleName ? 0 : 1);
}

// Model generation functions removed

try {
  execSync(
    `nest g mo modules/${moduleName} && nest g co modules/${moduleName} --no-spec && nest g s modules/${moduleName} --no-spec`,
    { stdio: 'inherit' },
  );
} catch (error) {
  process.exit(1);
}
