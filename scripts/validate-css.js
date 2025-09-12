import fs from "fs"
import path from "path"

console.log("🔍 Validating CSS syntax...\n")

const cssPath = path.join(process.cwd(), "app", "globals.css")

try {
  const cssContent = fs.readFileSync(cssPath, "utf8")

  console.log("📄 CSS file found and readable")
  console.log(`📏 File size: ${cssContent.length} characters`)

  // Basic syntax validation
  const issues = []

  // Check for unmatched braces
  const openBraces = (cssContent.match(/{/g) || []).length
  const closeBraces = (cssContent.match(/}/g) || []).length

  if (openBraces !== closeBraces) {
    issues.push(`Unmatched braces: ${openBraces} opening, ${closeBraces} closing`)
  }

  // Check for unmatched parentheses
  const openParens = (cssContent.match(/\(/g) || []).length
  const closeParens = (cssContent.match(/\)/g) || []).length

  if (openParens !== closeParens) {
    issues.push(`Unmatched parentheses: ${openParens} opening, ${closeParens} closing`)
  }

  // Check for incomplete rules (lines ending with incomplete syntax)
  const lines = cssContent.split("\n")
  const problematicLines = []

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Check for incomplete property declarations
    if (
      trimmed.includes(":") &&
      !trimmed.includes(";") &&
      !trimmed.includes("{") &&
      !trimmed.includes("}") &&
      trimmed !== ""
    ) {
      if (!trimmed.endsWith("*/") && !trimmed.startsWith("/*") && !trimmed.startsWith("//")) {
        problematicLines.push({
          line: index + 1,
          content: trimmed,
          issue: "Missing semicolon",
        })
      }
    }

    // Check for incomplete selectors
    if (trimmed.endsWith(",")) {
      problematicLines.push({
        line: index + 1,
        content: trimmed,
        issue: "Incomplete selector (ends with comma)",
      })
    }
  })

  // Report results
  if (issues.length === 0 && problematicLines.length === 0) {
    console.log("✅ CSS syntax validation passed!")
    console.log(`📊 Statistics:`)
    console.log(`   - ${openBraces} CSS rules`)
    console.log(`   - ${lines.length} lines`)
    console.log(`   - ${(cssContent.match(/@import/g) || []).length} imports`)
    console.log(`   - ${(cssContent.match(/--[\w-]+:/g) || []).length} CSS variables`)
  } else {
    console.log("⚠️  CSS validation issues found:\n")

    issues.forEach((issue) => {
      console.log(`❌ ${issue}`)
    })

    if (problematicLines.length > 0) {
      console.log("\n📍 Problematic lines:")
      problematicLines.forEach(({ line, content, issue }) => {
        console.log(`   Line ${line}: ${issue}`)
        console.log(`   Content: "${content}"`)
      })
    }
  }
} catch (error) {
  console.error("❌ Error reading CSS file:", error.message)
}
