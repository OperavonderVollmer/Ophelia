# Ophelia Suite

**Unified Automation Framework**

Ophelia serves as the central orchestration hub for a modular collection of Python-based automation tools. It enforces a strict plugin architecture (via PluginTemplate standards) to integrate standalone utilities—such as metadata extraction, text-to-speech, translation, and screen monitoring—into a cohesive system. A React Native frontend provides user-friendly access while preserving independent plugin execution.

## Architecture Overview

- **`Backend/`**: Core Python orchestration engine. Manages plugin discovery, lifecycle (prep → execute → cleanup), and inter-plugin communication.
- **`UI/`**: React Native cross-platform interface (iOS/Android/Desktop via Expo). Enables intuitive control and monitoring of backend operations.
- **Plugin System**: All tools adhere to the abstract base class defined in [PluginTemplate](https://github.com/OperavonderVollmer/PluginTemplate), ensuring metadata consistency, error handling, and extensibility.

## Current Status

Current development milestone (as of February 2025):
- Refining logic behind connection of frontend and backend

Future development milestone:
- Plugin selection from frontend
