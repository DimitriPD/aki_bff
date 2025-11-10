import express from 'express';
import fs from 'fs';
import path from 'path';

// Dynamic vertical slice router builder.
// Each slice that exposes a `router.ts` with an exported buildXRouter() (or buildRouter())
// will be auto-discovered and mounted under its own base path.
export function buildFeatureRouter() {
  const root = express.Router();
  const baseDir = __dirname; // features directory

  const sliceDirs = fs
    .readdirSync(baseDir)
    .filter((name) => {
      const full = path.join(baseDir, name);
      return fs.statSync(full).isDirectory() && !name.startsWith('_');
    });

  sliceDirs.forEach((dir) => {
    // Look for router module (ts during dev, js after build)
    const modulePath = path.join(baseDir, dir, 'router');
    const tsFile = modulePath + '.ts';
    const jsFile = modulePath + '.js';
    if (fs.existsSync(tsFile) || fs.existsSync(jsFile)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(modulePath);
        const builder =
          mod.buildRouter ||
          mod.buildEventsRouter ||
          mod.buildSliceRouter ||
          mod.default ||
          mod.router;

        let sliceRouter: any = null;
        if (typeof builder === 'function') {
          sliceRouter = builder();
        } else if (builder && builder.handle && builder.use) {
          // Already a Router instance
          sliceRouter = builder;
        }

        if (sliceRouter) {
          // Mount events router under /events, others under /<slice>
          // If the router already uses base-relative paths ("/"), this will work.
          const mountPath = dir === 'events' ? '/events' : `/${dir}`;
          root.use(mountPath, sliceRouter);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load router for slice '${dir}':`, e);
      }
    }
  });

  return root;
}