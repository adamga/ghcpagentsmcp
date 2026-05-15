# GitHub Copilot Agents and MCP (training) - Demos Instructions

> [!NOTE]
> This is a demo so it means that the trainer has to run the demo himself

This document quickly describes the content of the demo. It is written for the engineers that is delivering the training.

## Prerequisites

- A GitHub account with Copilot enabled, access to Copilot Cloud Agent and access to the Agent Mode.
- An IDE with GitHub Copilot Chat enabled and configured to use Agent Mode.
- A GitHub account and an IDE with access to MCP server.

## Environment configuration

Everything is descripted step by step before each exercise.

## Recommended demo path

1. Start with Demo 1 to establish the application and Cloud Agent workflow.
2. Continue with Demo 2 to show a larger feature crossing frontend, backend, and tests.
3. Use Demo 3 to compare local Agent Mode with Cloud Agent.
4. Introduce MCP in Demo 4 and Demo 5, including how external context changes the agent workflow.
5. Use Demo 6 and Demo 7 for advanced customization with hooks and skills.
6. Finish with Demo 8 to show Copilot CLI repository exploration from the terminal.

## Intentional training gaps

Some exercises intentionally begin from a simple or incomplete implementation so Copilot has meaningful work to perform. The Book Favorites app now includes baseline hardening and favorite-management features, but the training path can still use targeted issues for search refinements, reviews, deployment, persistence, and additional security improvements.

## Part 1: GitHub Copilot Cloud Agent

- [Demo 1: Using GitHub Copilot Cloud Agent to add a (basic) new feature](01-coding-agent-basic.md)
- [Demo 2: Using GitHub Copilot Cloud Agent to add a (medium) new feature](02-coding-agent-medium.md)
- [Demo 6: Using GitHub Copilot Cloud Agent with hooks to log session start](14-coding-agent-hooks.md)

## Part 2: GitHub Copilot Chat in Agent Mode

- [Demo 3: Using GitHub Copilot Chat in Agent Mode to add a (basic) new feature](11-agent-mode-basic.md)
- [Demo 7: Using GitHub Copilot Chat in Agent Mode with a agent skills](15-agent-mode-skills.md)

## Part 3: GitHub Copilot Cloud Agent with MCP

- [Demo 4: Using GitHub Copilot Cloud Agent with MCP to fix a security alert](12-coding-agent-advanced.md)

## Part 4: GitHub Copilot Chat in Agent Mode with MCP

- [Demo 5: Using GitHub Copilot Chat in Agent Mode to add a (medium) new feature](13-agent-mode-advanced.md)

## Part 5: GitHub Copilot CLI

- [Demo 8: Using GitHub Copilot CLI on local terminal](16-copilot-cli.md)
