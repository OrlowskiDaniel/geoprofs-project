import { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // Connect the authentication API here when the backend is ready.
    setMessage("This is just a form");
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo">GP</div>
        <h1>Login</h1>
        <p className="login-description">Log in to continue.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">Log in</button>
        </form>

        {message && (
          <p className="login-message" role="status">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}