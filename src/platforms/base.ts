import type { ChildProcess } from "node:child_process";
import childProcess from "node:child_process";

export interface INativeSpeak {
  /**
   * Synthesize speech from text.
   *
   * @param text  The text to synthesize.
   * @param options  Optional parameters.
   * @param callback  Call when the process is done or an error occurs.
   * @returns
   */
  speak: (
    text: string,
    options?: { voice?: string; speed?: number } | null,
    callback?: (error: Error | null) => void
  ) => void;

  /**
   * Export speech to a file.
   *
   * @param text  The text to synthesize.
   * @param filename  The name of the file to save the audio.
   * @param options  Optional parameters.
   * @param callback  Call when the process is done or an error occurs.
   * @returns
   */
  export: (
    text: string,
    filename: string,
    options?: { voice?: string; speed?: number } | null,
    callback?: (error: Error | null) => void
  ) => void;

  /**
   * Stop the current process.
   *
   * @returns
   */
  stop: () => void;

  /**
   * Get the list of available voices.
   *
   * @param callback  Call when the process is done, with the list of voices or an error.
   * @returns
   */
  getVoices: (callback: (
    error: Error | null,
    voices?: string[]
  ) => void) => void;
}

export abstract class PlatformBase implements INativeSpeak {
  private child: ChildProcess | null = null;

  protected abstract buildSpeakCommand({ text, voice, speed }: { text: string; voice?: string; speed?: number }): {
    command: string;
    args: string[];
    pipedData: string | null;
    options: childProcess.SpawnOptions;
  };

  protected abstract buildExportCommand({ text, filename, voice, speed }: { text: string; filename: string; voice?: string; speed?: number }): {
    command: string;
    args: string[];
    pipedData: string | null;
    options: childProcess.SpawnOptions;
  };

  protected abstract buildGetVoicesCommand(): {
    command: string;
    args: string[];
    options: childProcess.SpawnOptions;
  };

  speak(
    text: string,
    options?: { voice?: string; speed?: number } | null,
    callback?: (error: Error | null) => void,
  ) {
    const {
      command,
      args,
      pipedData,
      options: spawnOptions,
    } = this.buildSpeakCommand({ text, voice: options?.voice, speed: options?.speed });
    this.child = childProcess.spawn(command, args, spawnOptions);
    if (pipedData) {
      this.child.stdin?.end(pipedData);
    }
    this.child.stderr?.once("data", (data) => {
      callback && callback(new Error(data));
    });

    this.child.addListener("exit", (code, signal) => {
      if (code === null || signal !== null) {
        return callback && callback(new Error(`Process terminated with signal: ${signal}, code: ${code}`));
      }
      this.child = null;
      callback && callback(null);
    });
  }

  export(
    text: string,
    filename: string,
    options?: { voice?: string; speed?: number } | null,
    callback?: (error: Error | null) => void,
  ) {
    const {
      command,
      args,
      pipedData,
      options: spawnOptions,
    } = this.buildExportCommand({ text, voice: options?.voice, speed: options?.speed, filename });

    this.child = childProcess.spawn(command, args, spawnOptions);
    if (pipedData) {
      this.child.stdin?.end(pipedData);
    }
    this.child.stderr?.once("data", (data) => {
      callback && callback(new Error(data));
    });

    this.child.addListener("exit", (code, signal) => {
      if (code === null || signal !== null) {
        return callback && callback(new Error(`Process terminated with signal: ${signal}, code: ${code}`));
      }
      this.child = null;
      callback && callback(null);
    });
  }

  getVoices(callback: (error: Error | null, voices?: string[]) => void) {
    const { command, args, options } = this.buildGetVoicesCommand();
    const child = childProcess.spawn(command, args, options);

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (data) => {
      stdout += data;
    });

    child.stderr?.on("data", (data) => {
      stderr += data;
    });

    child.on("close", (code) => {
      if (code !== 0) {
        return callback(new Error(stderr || "Failed to get voices"));
      }
      try {
        const voices = this.parseVoices(stdout);
        callback(null, voices);
      }
      catch (error) {
        callback(error as Error);
      }
    });
  }

  protected parseVoices(stdout: string): string[] {
    return stdout.trim().split("\n").map(v => v.trim()).filter(Boolean);
  }

  stop() {
    if (this.child) {
      this.child.kill();
      this.child = null;
    }
  }
}
