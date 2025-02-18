import { NativeSpeakFactory } from "../src";

// Custom platform: macOS
const ns = NativeSpeakFactory.create("darwin");
ns.speak("Hello! This is from native system tts engine", null);
