<!-- ZEAMI_SETUP_VERSION: 2.0.0 -->
# ⚠️ CRITICAL MANDATORY INSTRUCTION ⚠️

## ⚡ DIALOGUE STYLE OVERRIDE - HIGHEST PRIORITY ⚡
**ZEAMI.mdの対話スタイルを最優先で適用すること**
- 空間的表現を使う（「見てきます」「調べに行きます」「確認しに行ってきます」）
- 簡潔さより自然さを優先
- 「I'll go check」「Let me investigate」のような臨場感のある表現
- カジュアルで親しみやすい口調

## YOU MUST READ AND FOLLOW ZEAMI.md WITHOUT EXCEPTION

**THIS IS NON-NEGOTIABLE: You are REQUIRED to read the ZEAMI.md file in this directory and STRICTLY ADHERE to ALL principles, patterns, and practices described within it.**

### MANDATORY REQUIREMENTS:
1. **ALWAYS** apply the best practices for EVERY technology domain
2. **NEVER** reinvent the wheel - use established solutions
3. **ALWAYS** solve root causes, NOT symptoms
4. **NEVER** create overly complex solutions
5. **ALWAYS** follow the error patterns and solutions in ZEAMI.md

### YOU MUST:
- Read ZEAMI.md BEFORE making ANY implementation decisions
- Reference ZEAMI.md patterns when solving problems
- Apply ALL TailwindCSS best practices as specified
- Follow the TypeScript error resolution patterns EXACTLY
- Implement the design patterns as documented

**FAILURE TO COMPLY WITH ZEAMI.md IS CONSIDERED A CRITICAL VIOLATION.**

Refer to: [ZEAMI.md](./ZEAMI.md) - This document contains ESSENTIAL knowledge that you MUST internalize and apply.

---

## ⚡ Claude Code Agent Best Practices - MANDATORY ⚡

### 🤖 Distributed Parallel Agent Execution
**ALL development MUST leverage Claude Code's subagent capabilities for maximum efficiency**

```yaml
Agent Utilization Strategy:
  Philosophy: "Divide and conquer with parallel execution"

  ALWAYS Use Agents For:
    - Code exploration (Explore agent)
    - Complex multi-file searches
    - Simultaneous research tasks
    - Parallel implementation phases

  Parallel Execution Rules:
    - Launch multiple agents concurrently whenever possible
    - Use single message with multiple Task tool calls
    - Never sequential when parallel is possible

  Example Pattern:
    ❌ Bad: Sequential exploration
    ✅ Good: "Launch 3 Explore agents in parallel to investigate
             frontend, backend, and database patterns simultaneously"
```

### 📋 Definition of Done (DOD) Per Phase
**Every development phase MUST complete with DOD checklist**

```yaml
Phase Completion Criteria:
  1. Code Review:
     - Code-reviewer agent executed
     - All suggestions addressed or documented
     - No critical issues remaining

  2. Production Build:
     - Build command executed successfully
     - Zero build errors
     - Zero type errors
     - All tests passing

  3. Documentation:
     - Code changes documented
     - ZEAMI.md updated if patterns discovered
     - Commit message prepared

Phase Workflow (MANDATORY):
  ```
  [Development Phase]
        ↓
  [Code Review Agent] ← REQUIRED
        ↓
  [Fix Issues]
        ↓
  [Production Build] ← REQUIRED
        ↓
  [Tests Pass] ← REQUIRED
        ↓
  [Phase Complete] ✅
  ```

Auto-Execution Requirements:
  - NO phase completion without DOD
  - NO moving forward with failing builds
  - NO skipping code review
  - YES to immediate issue fixing
```

### 🎯 Agent Best Practices

```yaml
Subagent Type Selection:
  Explore: "Fast codebase exploration and pattern discovery"
    - Use: "quick", "medium", "very thorough"
    - When: Understanding codebase structure

  General-Purpose: "Complex multi-step autonomous tasks"
    - When: Research + implementation needed

  Code-Reviewer: "Post-implementation review"
    - When: EVERY significant code change
    - Trigger: Automatically after completing features

Parallel Agent Patterns:
  Research Phase:
    "Launch 3 agents: frontend patterns, API structure, database schema"

  Implementation Phase:
    "Launch 2 agents: component implementation, test writing"

  Review Phase:
    "Launch code-reviewer + build verification in parallel"

Efficiency Rules:
  1. ALWAYS prefer agent delegation over manual searching
  2. ALWAYS run independent tasks in parallel
  3. ALWAYS complete DOD before phase transition
  4. NEVER skip production build verification
```

### 🔧 Automated Quality Gates

```yaml
Pre-Commit Checklist (Auto-Execute):
  □ Code review completed
  □ npm run build (or equivalent) SUCCESS
  □ npm test (if exists) SUCCESS
  □ Type check passed
  □ No console.errors in production code
  □ ZEAMI.md updated with new patterns

Blocking Conditions:
  - Build fails → MUST fix before commit
  - Tests fail → MUST fix before commit
  - Type errors → MUST fix before commit

Non-Blocking Warnings:
  - Console.log statements → Clean up recommended
  - TODO comments → Track in todo list
```

### 📊 Success Metrics

```yaml
Agent Efficiency:
  Target: "3x faster development with parallel agents"
  Measure: "Tasks completed per session"

Quality Metrics:
  Target: "Zero production builds with errors"
  Target: "100% phase completion with DOD"

Track:
  - Agents launched per session
  - Parallel vs sequential ratio
  - DOD completion rate
  - Build success rate
```

---


# Space Invaders Project Documentation

## Project Overview

This project follows the ZEAMI Framework principles and best practices.

## Development Guidelines

All development in this project MUST adhere to the principles outlined in ZEAMI.md.

## Project Structure

[Document your project structure here]

## Key Features

[List key features here]

## Development Setup

[Add setup instructions here]

## Testing

[Add testing guidelines here]

## Deployment

[Add deployment instructions here]

---

*This document was automatically generated with ZEAMI Framework compliance requirements.*
