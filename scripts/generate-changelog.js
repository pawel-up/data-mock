#!/usr/bin/env node
/* eslint-disable no-undef */

import { execSync } from 'child_process'

try {
  // Generate changelog with the latest release using conventionalcommits preset
  // This will only show feat, fix, and breaking change commits
  const output = execSync(
    'npx conventional-changelog --preset conventionalcommits --release-count 1 --stdout 2>/dev/null',
    {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }
  ).trim()

  // Output the changelog if there's meaningful content (not just headers with no body)
  if (output && output.split('\n').filter((line) => line.trim() && !line.startsWith('#')).length > 0) {
    process.stdout.write(output + '\n')
  } else {
    // If no conventional commits (feat/fix) were found, get the last few commits
    // This ensures release notes aren't empty
    const fallbackOutput = execSync(
      'git log --oneline -5 $(git describe --tags --abbrev=0)..HEAD 2>/dev/null | head -20 || git log --oneline -5',
      {
        cwd: process.cwd(),
        encoding: 'utf-8',
      }
    ).trim()

    if (fallbackOutput) {
      process.stdout.write('## Changes\n\n')
      fallbackOutput.split('\n').forEach((line) => {
        process.stdout.write(`* ${line}\n`)
      })
    } else {
      process.stdout.write('## Unreleased\n\nNo changes to report.\n')
    }
  }
} catch {
  // For any errors, output unreleased section
  process.stdout.write('## Unreleased\n\nChangelog generation skipped.\n')
}
