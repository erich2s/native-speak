import type { SpawnOptions } from "node:child_process";
import { PlatformBase } from "./base";

const COMMAND = "say";
export class PlatformDarwin extends PlatformBase {
  buildSpeakCommand({ text, voice, speed }: { text: string; voice?: string; speed?: number }) {
    const args = [];
    const pipedData = null;
    const options = {};

    args.push(text);
    if (voice) {
      args.push("-v", voice);
    }
    if (speed) {
      args.push("-r", speed.toString());
    }

    return { command: COMMAND, args, pipedData, options };
  }

  buildExportCommand({ text, filename, voice, speed }: { text: string; filename: string; voice?: string; speed?: number }): { command: string; args: string[]; pipedData: string | null; options: SpawnOptions } {
    const args = [];
    const pipedData = null;
    const options = {};

    args.push(text);
    if (voice) {
      args.push("-v", voice);
    }
    if (speed) {
      args.push("-r", speed.toString());
    }
    args.push("-o", filename);

    return { command: COMMAND, args, pipedData, options };
  }

  buildGetVoicesCommand() {
    return { command: COMMAND, args: ["--voice=?"], options: {} };
  }
}
