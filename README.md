# Ophelia Suite

**Unified Automation Framework**

Ophelia serves as the central orchestration hub for a modular collection of Python-based automation tools. It enforces a strict plugin architecture (via PluginTemplate standards) to integrate standalone utilities—such as metadata extraction, text-to-speech, translation, and screen monitoring—into a cohesive system. A React Native frontend provides user-friendly access while preserving independent plugin execution.

## Architecture Overview

- **`Backend/`**: Core Python orchestration engine. Manages plugin discovery, lifecycle (prep → execute → cleanup), and inter-plugin communication.
- **`UI/`**: React Native cross-platform interface (iOS/Android/Desktop via Expo). Enables intuitive control and monitoring of backend operations.
- **Plugin System**: All tools adhere to the abstract base class defined in [PluginTemplate](https://github.com/OperavonderVollmer/PluginTemplate), ensuring metadata consistency, error handling, and extensibility.

## Current Status

Active early development (as of December 2025):
- Backend relocation and initial plugin integration complete.
- ScreenMonitor plugin added as proof-of-concept.
- React Native UI ported from Ortlinde repository—basic scaffolding in place.

Future milestones:
- Full plugin registry and dynamic loading.
- Enhanced UI for plugin configuration and real-time feedback.
- Integration of existing tools (FileWhisperer, OPR-Speaks, WhisperTranslate, etc.).

