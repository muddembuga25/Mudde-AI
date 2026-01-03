
export const VIRTUAL_FILES: Record<string, string> = {
  "infrastructure/Dockerfile": `# MUDDE_PRIME // DEPLOYMENT_CONTAINER
# STAGE 1: QUANTUM_BUILD
FROM node:20-alpine as builder
WORKDIR /app

# Copy dependency manifest
COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies (Legacy Peer Deps for reliability)
RUN npm install --legacy-peer-deps

# Copy Source Matrix
COPY . .

# Execute Transpilation
RUN npm run build

# STAGE 2: NGINX_SERVING_LAYER
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY infrastructure/nginx.conf /etc/nginx/conf.d/default.conf

# Expose Port 80 for Dokploy Traefik Routing
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`,

  "infrastructure/nginx.conf": `server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip Compression for bandwidth efficiency
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public";
    }
}`,

  "package.json": `{
  "name": "mudde-singularity-node",
  "version": "9.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.344.0",
    "recharts": "^2.12.0",
    "@google/genai": "^0.1.1",
    "three": "^0.160.0",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@types/three": "^0.160.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}`,

  "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  define: {
    'process.env': process.env
  }
});`,

  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "**/*.ts", "**/*.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  "infrastructure/hostinger_deploy.ts": `// OBSOLETE - REPLACED BY DOCKER INFRASTRUCTURE
// SEE Dockerfile for deployment logic.
export const executeGlobalDeploy = async () => {
  console.log(">> REDIRECTING TO DOKPLOY_PIPELINE...");
};`,

  "App.tsx": `import React, { useState, useEffect, useCallback, useRef } from 'react';
// ... (The rest of App.tsx content is dynamically managed by the system)
// Note: When bundling for Dokploy, ensure all imports are relative (./)
`,
};

// HELPER: Sync Real files to Virtual for bundling
// In a real dev environment, we would read fs. 
// Here, we ensure key files are present in the virtual map for the zipper.
export const refreshVirtualFileSystem = (realFiles: Record<string, string>) => {
    Object.assign(VIRTUAL_FILES, realFiles);
};

type Listener = () => void;
const listeners: Listener[] = [];

export const updateVirtualFile = (path: string, content: string) => {
    VIRTUAL_FILES[path] = content;
    listeners.forEach(l => l());
};

export const subscribeToFiles = (l: Listener) => {
    listeners.push(l);
    return () => { 
        const idx = listeners.indexOf(l); 
        if (idx > -1) listeners.splice(idx, 1); 
    };
};