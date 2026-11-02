import { useState } from "react";

const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  iban: "",
};

function Field({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-lg">
        {label} {required && <span aria-label="required">*</span>}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={name === "iban" ? "off" : "on"}
        className="w-full rounded-md border border-white/40 bg-white px-4 py-3 font-sans text-base text-[#1f2937] outline-none focus:outline-3 focus:outline-offset-2 focus:outline-white"
      />
    </label>
  );
}

export default function PersonalData() {
  const [profile, setProfile] = useState(emptyProfile);
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [notice, setNotice] = useState("");

  function updateProfile(event) {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  }

  function updatePassword(event) {
    const { name, value } = event.target;
    setPasswords((previous) => ({ ...previous, [name]: value }));
  }

  function saveProfile(event) {
    event.preventDefault();

    const iban = profile.iban.replace(/\s/g, "").toUpperCase();
    if (iban && !/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(iban)) {
      setNotice("Invalid IBAN format. Check the IBAN and try again.");
      return;
    }

    // Send the current user's profile to the backend when the API is ready.
    setNotice(
      "The information is valid, but it has not been saved. Backend connection is required."
    );
  }

  function changePassword(event) {
    event.preventDefault();

    if (passwords.newPassword !== passwords.confirm) {
      setNotice("The new passwords do not match.");
      return;
    }

    // The backend must verify the current password and save the new one.
    setNotice(
      "Your password has not been changed. Backend connection is required."
    );
  }

  return (
    <main className="min-h-svh bg-[#f7f5ff] px-5 py-10 font-['Comic_Sans_MS','Segoe_Print',cursive]">
      <div className="mx-auto max-w-[900px]">
        <h1 className="mb-12 text-center text-4xl leading-tight text-[#6638d7] sm:text-[60px]">
          Change personal data
        </h1>

        <div className="mx-auto max-w-[736px] bg-[#6335d1] px-6 py-10 text-white sm:px-12 sm:py-14">
          <form onSubmit={saveProfile}>
            <h2 className="mb-6 text-2xl">Your profile</h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="First name" name="firstName" value={profile.firstName} onChange={updateProfile} required />
              <Field label="Last name" name="lastName" value={profile.lastName} onChange={updateProfile} required />
              <Field label="Email address" name="email" type="email" value={profile.email} onChange={updateProfile} required />
              <Field label="Phone number" name="phone" type="tel" value={profile.phone} onChange={updateProfile} />
              <div className="sm:col-span-2">
                <Field label="Street address" name="address" value={profile.address} onChange={updateProfile} />
              </div>
              <Field label="City" name="city" value={profile.city} onChange={updateProfile} />
              <Field label="Postal code" name="postalCode" value={profile.postalCode} onChange={updateProfile} />
              <div className="sm:col-span-2">
                <Field label="IBAN" name="iban" value={profile.iban} onChange={updateProfile} />
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 cursor-pointer rounded-md bg-white px-7 py-3 text-lg text-[#6335d1] hover:bg-[#eee9ff]"
            >
              Save personal data
            </button>
          </form>

          <hr className="my-10 border-white/40" />

          <form onSubmit={changePassword}>
            <h2 className="mb-6 text-2xl">Change password</h2>

            <div className="grid gap-6">
              <Field label="Current password" name="current" type="password" value={passwords.current} onChange={updatePassword} required />
              <Field label="New password" name="newPassword" type="password" value={passwords.newPassword} onChange={updatePassword} required />
              <Field label="Confirm new password" name="confirm" type="password" value={passwords.confirm} onChange={updatePassword} required />
            </div>

            <button
              type="submit"
              className="mt-8 cursor-pointer rounded-md bg-white px-7 py-3 text-lg text-[#6335d1] hover:bg-[#eee9ff]"
            >
              Change password
            </button>
          </form>
        </div>
      </div>

      {notice && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="notice-title"
          className="fixed inset-0 z-20 grid place-items-center bg-black/50 p-5"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 font-sans text-[#1f2937] shadow-xl">
            <h2 id="notice-title" className="mb-3 text-xl font-semibold">
              Notice
            </h2>
            <p>{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="mt-6 rounded-md bg-[#6335d1] px-5 py-2 text-white"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}