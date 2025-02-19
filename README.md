# 🗣️ Native Speak

This project is inspired by [say.js](https://github.com/Marak/say.js). It provides a simple way to use the native text-to-speech (TTS) engines on Windows and MacOS.

## ✨ Features

- Uses system native tts engines
- 100% TypeScript
- 0 dependencies

## Platform Support

- Windows (using `SAPI`)
- macOS (using `say` command)

## Installation

```bash
pnpm add native-speak
```

## Quick Start

```typescript
import ns from "native-speak";

// Use default system voice and speed
ns.speak("Hello!");

// Stop the text currently being spoken
ns.stop();
```

## API

### `speak(text, options?, callback?)`

Synthesize speech from text.

- `text: string` - The text to be spoken
- `options?: object` - Optional parameters
  - `voice?: string` - Voice name to use
  - `speed?: number` - Speaking speed
- `callback?: (error: Error | null) => void` - Called when speech is finished or an error occurs

```typescript
// Using options and callback
ns.speak("Hello!", { voice: "Alex", speed: 300 }, (error) => {
  if (error) {
    console.error("Speech failed:", error);
  }
  else {
    console.log("Speech completed");
  }
});
```

### `export(text, filename, options?, callback?)`

Export speech to an audio file.

- `text: string` - The text to synthesize
- `filename: string` - Path to save the audio file
- `options?: object` - Optional parameters
  - `voice?: string` - Voice name to use
  - `speed?: number` - Speaking speed
- `callback?: (error: Error | null) => void` - Called when export is finished or an error occurs

```typescript
ns.export("Hello!", "output.m4a", { voice: "Alex" }, (error) => {
  if (error) {
    console.error("Export failed:", error);
  }
  else {
    console.log("Audio file saved");
  }
});
```

### `stop()`

Stop the current speech.

```typescript
ns.stop();
```

### `getVoices(callback)`

Get a list of available voices.

- `callback: (error: Error | null, voices?: string[]) => void` - Called with the list of voices or an error

```typescript
ns.getVoices((error, voices) => {
  if (error) {
    console.error("Failed to get voices:", error);
  }
  else {
    console.table("Available voices:", voices);
  }
});
```

## Others

If you want to create a specified platform of ns instance, you can use the `NativeSpeakFactory.create()` method.

```typescript
import { NativeSpeakFactory } from "native-speak";

// Create a Windows ns instance
const customNs = NativeSpeakFactory.create("win32");
customNs.speak("Hello!");
```
