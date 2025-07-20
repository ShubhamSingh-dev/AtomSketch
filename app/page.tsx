"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              AtomSketch: <span className="text-blue-600">Collaborative</span>
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mt-2">
              Creativity Unleashed
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto "
            style={{marginTop: "1rem"}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Draw, design, and innovate together in real-time. Experience
            seamless collaboration on a shared canvas.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Link href="/canvas">
              <motion.button
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  fontWeight: "600",
                  marginTop: "1rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "9999px",
                  fontSize: "1.125rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s ease-in-out",
                  border: "none",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Sketching
              </motion.button>
            </Link>
          </motion.div>

          {/* Simple feature cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto"
            style={{ paddingTop: "3rem" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-time
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborate instantly with your team
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Creative Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Professional drawing features
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Cloud Sync
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access your work anywhere
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
