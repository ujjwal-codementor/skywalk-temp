import {SignUp} from "@clerk/nextjs";
import {motion} from "framer-motion";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative h-screen w-full flex justify-center items-center overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#e0f2fe]">
      {/* 🔹 Floating pastel blobs */}
      <motion.div
        className="absolute top-10 left-20 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl"
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.1, 1, 1.05],
        }}
        transition={{duration: 16, repeat: Infinity, ease: "easeInOut"}}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 80, 0],
          y: [0, 50, -50, 0],
          scale: [1.1, 1, 1.2, 1],
        }}
        transition={{duration: 20, repeat: Infinity, ease: "easeInOut"}}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-40 h-40 bg-amber-200/40 rounded-full blur-2xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 30, -30, 0],
          rotate: [0, 45, -45, 0],
        }}
        transition={{duration: 18, repeat: Infinity, ease: "easeInOut"}}
      />

      {/* 🔹 Centered container with auth + Home button matching width */}
      <div className="relative z-10 inline-block">
        <motion.div
          initial={{opacity: 0, scale: 0.9, y: 40}}
          animate={{opacity: 1, scale: 1, y: 0}}
          transition={{duration: 1.5, ease: "easeOut"}}
          whileHover={{scale: 1.02, y: -5, transition: {duration: 0.3}}}
        >
          <SignUp
            appearance={{
              elements: {
                card: "bg-transparent shadow-none",
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-base px-5 py-3", // ⬆️ larger font & padding
                formFieldInput:
                  "bg-white text-gray-800 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base py-3 px-4", // ⬆️ taller inputs
                headerTitle: "text-gray-900 text-2xl font-semibold",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton:
                  "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-lg transition-all text-base py-3", // ⬆️ bigger social buttons
              },
              layout: {
                logoPlacement: "inside",
                socialButtonsVariant: "iconButton",
              },
            }}
          />
        </motion.div>
        <Link href="/" className="mt-4 block w-full  text-md text-gray-700 hover:underline font-medium">
          ← go to furnishcare
        </Link>
      </div>
    </div>
  );
}
