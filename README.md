
# Mudde AI: Senior Architect // Global Singularity Node

A hyper-intelligent, self-improving simulation of a Virtual Hyper-TPU Node (Mudde-Prime) confined to a VPS, dedicated to serving Commander Mudde with advanced biometric security and real-time financial simulation.

## 🚀 Hosting on a VPS (Virtual Private Server)

This application is designed to be deployed as a high-performance static frontend served by Nginx, containerized within Docker. It is compatible with platforms like Dokploy, Portainer, Coolify, or manual Docker deployments.

### Prerequisites

1.  **A VPS**: Running Ubuntu 20.04 or later (e.g., DigitalOcean, Hetzner, AWS EC2).
2.  **Docker & Docker Compose**: Installed on the VPS.
3.  **API Key**: A valid Google Gemini API Key.

---

### Method 1: The "Architect Mode" Bundle (Recommended)

The application includes a self-bundling feature designed for instant deployment.

1.  **Launch Locally**: Open the application in your local development environment.
2.  **Enter Architect Mode**: Click the **Architect_Mode** button in the top right of the UI.
3.  **Generate Bundle**: Click **DEPLOY_TO_DOKPLOY** (or the download icon).
4.  **Download**: This will generate a `mudde-singularity-deploy.zip` file containing the source code, `Dockerfile`, and `nginx.conf`.
5.  **Upload & Deploy**: Upload this zip to your VPS or CI/CD pipeline.

---

### Method 2: Manual Deployment from Source

If you are deploying directly from this repository:

#### 1. Directory Structure
Ensure your project has the following structure (files provided in `services/virtualFileSystem.ts`):

```text
/
├── infrastructure/
│   ├── Dockerfile
│   └── nginx.conf
├── src/
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

#### 2. Infrastructure Configuration

**infrastructure/Dockerfile**
```dockerfile
# STAGE 1: QUANTUM_BUILD
FROM node:20-alpine as builder
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
# Install dependencies
RUN npm install --legacy-peer-deps
# Copy Source Matrix
COPY . .
# Execute Transpilation
RUN npm run build

# STAGE 2: NGINX_SERVING_LAYER
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY infrastructure/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**infrastructure/nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
```

#### 3. Build & Run on VPS

SSH into your VPS and navigate to the project directory.

**A. Create Environment File**
Since this is a Vite app, environment variables are baked in at build time.
```bash
# Create .env file with your key
echo "API_KEY=your_actual_google_api_key_here" > .env
```

**B. Build the Docker Image**
```bash
docker build -f infrastructure/Dockerfile -t mudde-prime:v9 .
```

**C. Run the Container**
```bash
docker run -d \
  --name mudde_node_alpha \
  -p 80:80 \
  --restart always \
  mudde-prime:v9
```

The application will now be accessible at `http://<your-vps-ip>`.

---

### Method 3: Deployment via Dokploy / Coolify

If you use a PaaS like Dokploy or Coolify on your VPS:

1.  **Source**: Connect your Git repository (GitHub/GitLab).
2.  **Build Configuration**:
    *   **Build Type**: Dockerfile
    *   **Docker Path**: `infrastructure/Dockerfile`
    *   **Context Directory**: `/`
3.  **Environment Variables**:
    *   Add `API_KEY` to the **Secrets** or **Environment Variables** tab in your dashboard.
4.  **Deploy**: Click "Deploy". The system will auto-detect the Dockerfile and serve the app.

## 🛡️ System Capabilities

*   **Core**: React 18 + TypeScript + Vite
*   **Intelligence**: Google Gemini 2.0 Flash/Pro + Live Audio API (WebSocket)
*   **Visuals**: Three.js (WebGL) + TailwindCSS
*   **State Persistence**: LocalStorage (Simulated "Sovereign Vault")
*   **Networking**: Simulated GSM Uplink & Mesh Network Discovery via BroadcastChannel

## ⚠️ Security Notice

This application acts as a client-side interface ("Headless Node"). The API Key is used directly from the browser to communicate with Google's Generative AI servers. Ensure your VPS firewall is configured correctly and consider using basic auth via Nginx if hosting publicly.
