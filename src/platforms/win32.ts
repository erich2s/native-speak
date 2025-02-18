import { PlatformBase } from "./base";

const COMMAND = "powershell.exe";
export class PlatformWin32 extends PlatformBase {
  buildSpeakCommand({ text, voice, speed }: { text: string; voice?: string; speed?: number }) {
    const args: string[] = [];
    const pipedData = `
      Add-Type -AssemblyName System.Speech;
      $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;
      ${voice ? `$speak.SelectVoice('${voice}');` : ""}
      ${speed ? `$speak.Rate = ${Math.min(Math.max(Math.floor((speed - 175) / 50), -10), 10)};` : ""}
      $speak.Speak('${text.replace(/'/g, "''")}');
      $speak.Speak([Console]::In.ReadToEnd())
    `.trim();
    const options = {};

    return { command: COMMAND, args, pipedData, options };
  }

  buildExportCommand({ text, filename, voice, speed }: { text: string; filename: string; voice?: string; speed?: number }) {
    const args: string[] = [];
    const pipedData = `
      Add-Type -AssemblyName System.Speech;
      $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;
      ${voice ? `$speak.SelectVoice('${voice}');` : ""}
      ${speed ? `$speak.Rate = ${Math.min(Math.max(Math.floor((speed - 175) / 50), -10), 10)};` : ""}
      $speak.SetOutputToWaveFile('${filename}');
      $speak.Speak('${text.replace(/'/g, "''")}');
      $speak.Dispose();
    `.trim();
    const options = {};

    return { command: COMMAND, args, pipedData, options };
  }

  buildGetVoicesCommand() {
    const script = `Add-Type -AssemblyName System.speech; $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }`;
    return {
      command: COMMAND,
      args: ["-Command", script],
      options: {},
    };
  }
}
