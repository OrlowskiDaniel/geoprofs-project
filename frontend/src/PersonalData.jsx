import { useState } from "react";
import { api } from "./api/client";

const emptyPasswords = {
  current: "",
  newPassword: "",
  confirm: "",
};

const inputClass =
  "w-full rounded-lg bg-white px-4 py-3 text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-white";

export default function PersonalData() {
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updatePassword(event) {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  async function changePassword(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setMessage("");

    if (passwords.newPassword.length < 8) {
      setError("The new password must contain at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      setError("The new passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.changePassword(
        passwords.current,
        passwords.newPassword,
        passwords.confirm
      );

      setPasswords(emptyPasswords);
      setMessage("Your password has been changed successfully.");
    } catch (error) {
      setError(
        error.message || "Unable to change your password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10 font-sans text-[#1f2937]">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold text-[#6335d1]">
          Change password
        </h1>

        <p className="mt-3 text-gray-600">
          Enter your current password and choose a new password.
        </p>

        <form
          onSubmit={changePassword}
          aria-busy={isSubmitting}
          className="mt-8 rounded-xl bg-[#6335d1] p-6 text-white sm:p-10"
        >
          <fieldset disabled={isSubmitting} className="min-w-0">
            <legend className="sr-only">Change your password</legend>

            <div className="grid gap-6">
              <label>
                <span className="mb-2 block font-medium">
                  Current password *
                </span>
                <input
                  name="current"
                  type="password"
                  autoComplete="current-password"
                  value={passwords.current}
                  onChange={updatePassword}
                  required
                  className={inputClass}
                />
              </label>

              <label>
                <span className="mb-2 block font-medium">
                  New password *
                </span>
                <input
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={updatePassword}
                  minLength={8}
                  aria-describedby="password-help"
                  required
                  className={inputClass}
                />
                <span
                  id="password-help"
                  className="mt-2 block text-sm text-white/80"
                >
                  Use at least 8 characters.
                </span>
              </label>

              <label>
                <span className="mb-2 block font-medium">
                  Confirm new password *
                </span>
                <input
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.confirm}
                  onChange={updatePassword}
                  minLength={8}
                  required
                  className={inputClass}
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-8 cursor-pointer rounded-lg bg-white px-6 py-3 font-semibold text-[#6335d1] hover:bg-[#eee8ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Change password"}
            </button>
          </fieldset>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-white p-4 text-red-700"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="mt-5 rounded-lg bg-white p-4 text-green-800"
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}