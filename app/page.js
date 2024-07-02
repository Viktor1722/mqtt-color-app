"use client";
import Head from "next/head";
import ColorDropdown from "./components/ColorDropdown";

export default function Home() {
  return (
    <div>
      <p className="bg-white text-black">MQTT Color Picker</p>

      <ColorDropdown />
    </div>
  );
}
