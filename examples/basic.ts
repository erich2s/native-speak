import { ns } from "../src";

ns.speak(
  "Hello! This is from native system tts engine",
  null,
  (error) => {
    if (error) {
      console.error(error);
    }
  },
);
