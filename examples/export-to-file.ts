import ns from "../src";

const filename = "output.aiff";
ns.export(
  "Hello! This is from native system tts engine",
  filename,
  null,
  (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`Exported to ${filename}`);
  },
);
