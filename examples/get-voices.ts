import { ns } from "../src";

ns.getVoices((error, voices) => {
  if (error) {
    console.error(error);
    return;
  }
  console.table(voices);
});
