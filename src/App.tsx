import Hero from "./components/Hero";
import "./App.css";

function App() {
  return (
    <div className="app">
      <main className="main">
        <div className="gradient" />
        <div className="z-50 max-w-5xl">
          <Hero />
        </div>
      </main>
    </div>
  );
}

export default App;
