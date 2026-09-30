import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

export default function AbsenceRequest() {
  return (
    <main className="min-h-screen bg-[#F5F3FF] text-[#6D28D9]">
      <div className="flex flex-col items-center pt-32">

        {/* Page title */}
        <h1 className="!text-5xl !font-normal !text-[#6D28D9]">
          Leave Request
        </h1>

        {/* Subtitle */}
        <h2 className="!mt-3 !text-2xl !font-normal !text-[#6D28D9]">
          Employee leave request
        </h2>

        <div className="mt-12 w-[550px] bg-white p-5">
          <div className="grid grid-cols-2 gap-x-24 gap-y-5">

            <Field label="Employee name:" />

            <Field label="Type of leave:" />

            <DateField label="Start date:" />

            <DateField label="End date:" />

          </div>

          <div className="mt-5">
            <label className="block text-[11px] text-gray-700">
              Reason for leave:
            </label>

            <div className="relative mt-2 w-full">
              <div className="pointer-events-none absolute inset-x-0 top-6 border-b border-gray-400" />
              <div className="pointer-events-none absolute inset-x-0 top-12 border-b border-gray-400" />

              <textarea
                rows="2"
                className="
                  relative
                  block
                  h-12
                  w-full
                  resize-none
                  overflow-hidden
                  border-0
                  bg-transparent
                  px-0
                  py-1
                  text-xs
                  leading-6
                  outline-none
                  focus:ring-0
                "
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


/* Normal text field */
function Field({ label }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-700">
        {label}
      </label>

      <input
        type="text"
        className="
          mt-2
          w-full
          border-0
          border-b
          border-gray-400
          bg-transparent
          px-0
          py-1
          text-xs
          outline-none
          focus:border-gray-700
          focus:ring-0
        "
      />
    </div>
  );
}


function DateField({ label }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-700">
        {label}
      </label>

      <input
        type="date"
        className="
          mt-2
          w-full
          border-0
          border-b
          border-gray-400
          bg-transparent
          px-0
          py-1
          text-xs
          text-gray-700
          outline-none
          focus:border-gray-700
          focus:ring-0

          [&::-webkit-calendar-picker-indicator]:cursor-pointer
          [&::-webkit-calendar-picker-indicator]:opacity-60
          [&::-webkit-calendar-picker-indicator]:hover:opacity-100
        "
      />
    </div>
  );
}