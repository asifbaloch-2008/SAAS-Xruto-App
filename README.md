# LoadBright - Intelligent Route Optimization System

A full-stack route optimization application that uses advanced algorithms to optimize delivery routes for maximum efficiency.

## 🚀 Features

- **Smart Route Optimization** using K-means clustering, workload balancing, and 2-opt algorithms
- **Real-time Route Assignment** for multiple drivers
- **Workload Balancing** to ensure fair distribution of deliveries
- **Interactive Dashboard** with real-time metrics and analytics
- **Address Upload** via CSV for batch processing
- **Customizable Parameters** for route optimization

## 🧮 Algorithms Implemented

### 1. K-means Clustering Algorithm
Groups delivery orders into geographic zones/clusters for efficient routing.

### 2. Workload Balancing Algorithm
Redistributes orders between clusters to avoid overloaded/underloaded routes.

### 3. 2-opt Route Optimization Algorithm
Optimizes the sequence of stops within each cluster to minimize travel distance.

### 4. Haversine Distance Formula
Calculates accurate geographic distance between coordinates on Earth's surface.

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup Steps

```sh
# Step 1: Navigate to the project directory
cd load-bright-main

# Step 2: Install frontend dependencies
npm install

# Step 3: Install backend dependencies
cd server
npm install
cd ..

# Step 4: Start both frontend and backend servers
npm run dev:all
```

## 🚀 Running the Application

### Run Both Frontend and Backend (Recommended)
```bash
npm run dev:all
```

This starts:
- Backend API server on `http://localhost:3001`
- Frontend dev server on `http://localhost:8080`

### Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 📊 Usage

1. **Upload Addresses** - Click "Upload CSV" or enter addresses manually
2. **Configure Settings** - Set driver count and route parameters
3. **Assign Routes** - Click "Assign" to distribute orders
4. **Optimize Routes** - Click "Optimize" to run advanced algorithms
5. **Export Results** - Download optimized routes

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Recharts** - Visualization

### Backend
- **Node.js** with Express
- **TypeScript** - Type safety
- Route optimization algorithms (K-means, 2-opt, workload balancing)

## 📁 Project Structure

```
├── src/              # Frontend React app
├── server/           # Backend API with algorithms
├── components/       # UI components
└── public/           # Static assets
```

## 🔧 API Endpoints

- `POST /api/optimize` - Optimize routes
- `POST /api/geocode` - Geocode addresses
- `GET /api/health` - Health check

See `server/README.md` for detailed API documentation.

## 📝 License

MIT

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
