import fs from "fs"

console.log("🔍 Searching for syntax errors...\n")

// Function to check for common syntax issues
function checkSyntaxIssues(content, filePath) {
  const issues = []

  // Check for unmatched parentheses
  const openParens = (content.match(/\(/g) || []).length
  const closeParens = (content.match(/\)/g) || []).length

  if (openParens !== closeParens) {
    issues.push(`Unmatched parentheses: ${openParens} open, ${closeParens} close`)
  }

  // Check for unmatched braces
  const openBraces = (content.match(/{/g) || []).length
  const closeBraces = (content.match(/}/g) || []).length

  if (openBraces !== closeBraces) {
    issues.push(`Unmatched braces: ${openBraces} open, ${closeBraces} close`)
  }

  // Check for unmatched brackets
  const openBrackets = (content.match(/\[/g) || []).length
  const closeBrackets = (content.match(/\]/g) || []).length

  if (openBrackets !== closeBrackets) {
    issues.push(`Unmatched brackets: ${openBrackets} open, ${closeBrackets} close`)
  }

  // Look for specific problematic patterns
  const lines = content.split("\n")
  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Check for incomplete function calls
    if (trimmed.includes("(") && !trimmed.includes(")") && trimmed.endsWith(",")) {
      issues.push(`Line ${index + 1}: Incomplete function call - "${trimmed}"`)
    }

    // Check for incomplete CSS calc functions
    if (trimmed.includes("calc(") && !trimmed.includes(")")) {
      issues.push(`Line ${index + 1}: Incomplete calc function - "${trimmed}"`)
    }

    // Check for incomplete template literals
    if (trimmed.includes("`") && (trimmed.match(/`/g) || []).length % 2 !== 0) {
      issues.push(`Line ${index + 1}: Unmatched template literal - "${trimmed}"`)
    }
  })

  return issues
}

// Files to check
const filesToCheck = [
  "app/globals.css",
  "components/ui/alert.tsx",
  "components/ui/button.tsx",
  "components/ui/card.tsx",
  "components/ui/input.tsx",
  "components/ui/tabs.tsx",
  "app/layout.tsx",
  "app/page.tsx",
]

let totalIssues = 0

for (const filePath of filesToCheck) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8")
      const issues = checkSyntaxIssues(content, filePath)

      if (issues.length > 0) {
        console.log(`❌ ${filePath}:`)
        issues.forEach((issue) => {
          console.log(`   ${issue}`)
        })
        console.log()
        totalIssues += issues.length
      } else {
        console.log(`✅ ${filePath}: No syntax issues found`)
      }
    } else {
      console.log(`⚠️  ${filePath}: File not found`)
    }
  } catch (error) {
    console.log(`❌ ${filePath}: Error reading file - ${error.message}`)
  }
}

console.log(`\n📊 Total issues found: ${totalIssues}`)

if (totalIssues === 0) {
  console.log("✅ No obvious syntax issues found in checked files")
  console.log("💡 The error might be in a different file or caused by a build tool configuration")
} else {
  console.log("🔧 Fix the issues above and try building again")
}
