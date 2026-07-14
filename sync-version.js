const fs = require('fs');
const path = require('path');

// 1. Leer versión del package.json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = pkg.version;

// versionCode basado en la versión (0.0.1 → 1, 0.1.0 → 10, 1.2.3 → 123)
const versionCode = parseInt(pkg.version.replace(/\D/g, '')) || 1;

console.log(`🔧 Sincronizando versión: ${version} (code: ${versionCode})`);

// ---------------------------------------------------------
// 2. Actualizar AndroidManifest.xml
// ---------------------------------------------------------
const androidManifestPath = path.join(
  __dirname,
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml'
);

if (fs.existsSync(androidManifestPath)) {
  let manifest = fs.readFileSync(androidManifestPath, 'utf8');

  manifest = manifest
    .replace(/android:versionName="[^"]*"/, `android:versionName="${version}"`)
    .replace(/android:versionCode="[^"]*"/, `android:versionCode="${versionCode}"`);

  fs.writeFileSync(androidManifestPath, manifest);
  console.log('✔ AndroidManifest.xml actualizado');
} else {
  console.warn('⚠ AndroidManifest.xml no encontrado');
}

// ---------------------------------------------------------
// 3. Actualizar Info.plist (iOS)
// ---------------------------------------------------------
const infoPlistPath = path.join(
  __dirname,
  'ios',
  'App',
  'App',
  'Info.plist'
);

if (fs.existsSync(infoPlistPath)) {
  let plist = fs.readFileSync(infoPlistPath, 'utf8');

  plist = plist
    .replace(
      /<key>CFBundleShortVersionString<\/key>\s*<string>[^<]*<\/string>/,
      `<key>CFBundleShortVersionString</key>\n\t<string>${version}</string>`
    )
    .replace(
      /<key>CFBundleVersion<\/key>\s*<string>[^<]*<\/string>/,
      `<key>CFBundleVersion</key>\n\t<string>${versionCode}</string>`
    );

  fs.writeFileSync(infoPlistPath, plist);
  console.log('✔ Info.plist actualizado');
} else {
  console.warn('⚠ Info.plist no encontrado');
}

console.log('🎉 Versión sincronizada correctamente');
