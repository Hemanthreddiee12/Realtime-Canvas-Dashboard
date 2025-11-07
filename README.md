# Performance-Critical Data Dashboard

This project is a submission for the Frontend Engineer assignment. 
It's a high-performance, real-time data dashboard built from scratch using Next.js 14 (App Router) and TypeScript.

The primary goal is to render and smoothly update 10,000+ data points at 60fps, without using any third-party charting libraries.


---

## 🚀 Core Features

* **60 FPS Performance:** Maintains a smooth 60fps frame rate, proven by the built-in FPS counter.
* **Real-time Data Stream:** Connects to a server-sent event (SSE) stream that delivers new data every 100ms.
* **10,000 Point Window:** Manages a sliding window of the latest 10,000 data points without memory leaks.
* **Four Chart Types:**
    * Line Chart
    * Scatter Plot
    * Bar Chart
    * Heatmap
* **Interactive Charts:** Features smooth zoom (mouse wheel) and pan (click + drag) on high-density charts.
* **Virtualized Data Table:** Renders all 10,000 data points in a scrollable table that maintains high performance by only rendering visible rows.
* **Data Aggregation:** Efficiently groups data into "10 Sec" or "30 Sec" averages using `useMemo`.
* **Live Filtering:** Filters the entire dataset in real-time by value range ("Filter Controls") and time window ("Time Range").

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router) & React 18
* **Language:** TypeScript
* **Rendering:** HTML5 Canvas (for 10k+ points) + SVG (for interactive overlays/axes)
* **State Management:** React Hooks + Context API (`DataProvider` and `useData` hook)
* **Data Stream:** Server-Sent Events (SSE) via a Next.js Route Handler
* **Styling:** Tailwind CSS

---

## 🔧 Setup & Running

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/hemanthreddiee12]
    cd performance-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    *(This runs the app using the stable Webpack bundler)*
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    The server will start at `http://localhost:3000`. You must manually navigate to the correct page:
    **`http://localhost:3000/dashboard`**

## 🧪 Performance Testing

1.  Open `http://localhost:3000/dashboard`.
2.  Observe the **FPS counter** in the top-right corner. It should stabilize at or near 60fps.
3.  Use the **mouse wheel** to zoom and **click-drag** to pan the Line and Scatter charts. Note the smooth interaction.
4.  Scroll the **Virtualized Data Table** on the right. Note that you can scroll through all 10,000 points instantly without any lag or frame drops.
5.  Let the app run for several minutes. The memory usage should remain stable, and the app should not freeze.
