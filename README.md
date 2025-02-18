# 🗣️ Native Speak

This project is inspired by [say.js]("https://github.com/Marak/say.js"). It is a simple text-to-speech library for node.js using system native tts engines.

## ✨ Features

- 100% TypeScript
- Supports Windows and MacOS (Linux is not supported yet)
- Use system native tts engines

## Usage

```typescript
import ns from "native-speak";

// Use default system voice and speed
ns.speak("Hello!");

// Stop the text currently being spoken
ns.stop();

// More complex example (with an OS X voice) and slow speed
ns.speak("What's up, dog?", "Alex", 0.5);
```
