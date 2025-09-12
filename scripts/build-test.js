import { spawn } from "child_process"

console.log("🚀 Running npm run build...\n")

const buildProcess = spawn("npm", ["run", "build"], {
  stdio: "pipe",
  shell: true,
})

let output = ""
let errorOutput = ""

buildProcess.stdout.on("data", (data) => {
  const text = data.toString()
  output += text
  process.stdout.write(text)
})

buildProcess.stderr.on("data", (data) => {
  const text = data.toString()
  errorOutput += text
  process.stderr.write(text)
})

buildProcess.on("close", (code) => {
  console.log(`\n📊 Build process finished with exit code: ${code}`)

  if (code === 0) {
    console.log("✅ Build successful!")
    console.log("\n📈 Build Summary:")

    // Extract key information from output
    const lines = output.split("\n")
    const relevantLines = lines.filter(
      (line) =>
        line.includes("Compiled successfully") ||
        line.includes("Route (app)") ||
        line.includes("Size") ||
        line.includes("First Load JS") ||
        line.includes("Error") ||
        line.includes("Warning"),
    )

    if (relevantLines.length > 0) {
      relevantLines.forEach((line) => console.log(`  ${line.trim()}`))
    }
  } else {
    console.log("❌ Build failed!")

    if (errorOutput) {
      console.log("\n🔍 Error Details:")
      console.log(errorOutput)
    }

    // Look for specific CSS errors
    if (output.includes("Unexpected token") || errorOutput.includes("Unexpected token")) {
      console.log("\n💡 CSS Syntax Error detected. Check globals.css for syntax issues.")
    }

    if (output.includes("Module not found") || errorOutput.includes("Module not found")) {
      console.log("\n💡 Module import error detected. Check import statements.")
    }
  }
})

buildProcess.on("error", (error) => {
  console.error("❌ Failed to start build process:", error.message)
})
