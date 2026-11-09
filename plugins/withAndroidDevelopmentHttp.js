const { withDangerousMod, AndroidConfig } = require('@expo/config-plugins');
const fs = require('node:fs/promises');
const path = require('node:path');

// El manifiesto principal rechaza HTTP. Solo la variante debug lo habilita para LAN/Metro.
module.exports = function withAndroidDevelopmentHttp(config) {
  return withDangerousMod(config, ['android', async (mod) => {
    const manifestPath = path.join(mod.modRequest.platformProjectRoot, 'app/src/debug/AndroidManifest.xml');
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    let manifest;
    try {
      manifest = await AndroidConfig.Manifest.readAndroidManifestAsync(manifestPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      manifest = { manifest: { $: { 'xmlns:android': 'http://schemas.android.com/apk/res/android' } } };
    }
    AndroidConfig.Manifest.ensureToolsAvailable(manifest);
    manifest.manifest.application ||= [{ $: {} }];
    const application = manifest.manifest.application[0].$;
    application['android:usesCleartextTraffic'] = 'true';
    const replacements = new Set((application['tools:replace'] || '').split(',').map((value) => value.trim()).filter(Boolean));
    replacements.add('android:usesCleartextTraffic');
    application['tools:replace'] = [...replacements].join(',');
    await AndroidConfig.Manifest.writeAndroidManifestAsync(manifestPath, manifest);
    return mod;
  }]);
};
