# In-House Tools

Amagari Studio does more than translate text. We build purpose-made tools around the Minecraft localization pipeline, connecting language ingestion, synchronization, review, and validation into a maintainable workflow. The first project presented here is **Amagari Translation Tool**.

## Amagari Translation Tool

> A Fabric translation-assistance mod for Minecraft map and mod localization. It brings language content directly into the running game and provides a shared foundation for collaborative work, remote synchronization, and bilingual review.

**GitHub:** <https://github.com/zuiter/Amagari-Translation-Tool>

### Runtime Language Loading

The tool reads JSON compatible with Minecraft resource-pack language files and loads translations dynamically into the client language table. Language data can come from a local world, a remote server, a LAN host, or a ParaTranz project, allowing map localization to be tested without repeatedly building and switching separate resource packs.

One language can also be divided across multiple files. A defined priority order combines session translations, world or remote language data, enabled resource packs, and the vanilla language table. This preserves original assets while giving map-specific text stable and predictable override behavior.

### Remote and LAN Synchronization

In multiplayer and LAN sessions, the host can publish a language manifest to joining players. Clients fetch only data that is missing locally or whose content hash has changed, while compressed transfer and local caching avoid unnecessary repeated downloads.

This synchronization model lets language content evolve alongside the server version and keeps every tester in the same language environment. Caches are isolated by server and language, with expiry cleanup and historical-version limits balancing update speed against local storage use.

### ParaTranz Workflow Integration

The tool connects to ParaTranz projects, pulls language JSON from the collaboration platform, and applies it immediately to the current game session. When needed, the result can also be persisted to the current local world language files.

This connects online collaboration and project exports directly to in-game validation, reducing interruptions caused by manual downloading, renaming, copying, and repackaging. Project access, exported artifacts, and local caches are managed through one workflow suited to continuously evolving map localizations.

### Bilingual Review and Source Comparison

The tool supports switching between target and source languages and can display traceable source text inside the game. Current review surfaces include item tooltips, translated signs, and book text.

Source views preserve available color, italic, argument, and layout information wherever possible, allowing translators to compare the source and translation in their real gameplay context instead of reviewing isolated spreadsheet strings. Fixed sign content such as lobby notices, quest prompts, and rules can also be localized at the client display layer through dedicated translation entries without modifying the world save itself.

### Engineering Reliability

- On-demand synchronization based on language manifests, content hashes, and compressed payloads.
- Cache isolation across local worlds, servers, and languages to prevent cross-project contamination.
- Automatic cleanup of stale remote caches and limits on retained language versions per server.
- Private command feedback visible only to the person who initiated an operation.
- Explicit payload boundaries that encourage projects to retain only necessary languages and namespaces.
- A defined translation priority order that makes conflicts between resource packs, world languages, and collaboration results easier to diagnose.
