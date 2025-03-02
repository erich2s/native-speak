import type Process from "node:process";
import type { INativeSpeak } from "./platforms/base";
import process from "node:process";
import { PlatformDarwin } from "./platforms/darwin";
import { PlatformWin32 } from "./platforms/win32";

export class NativeSpeakFactory {
  static create(platform?: typeof Process["platform"]): INativeSpeak {
    const _platform = platform ?? process.platform;
    if (_platform === "darwin") {
      return new PlatformDarwin();
    }
    else if (_platform === "win32") {
      return new PlatformWin32();
    }
    else {
      throw new Error(`Platform ${_platform} is not supported`);
    }
  }
}

export const ns = NativeSpeakFactory.create();

export type { INativeSpeak };
