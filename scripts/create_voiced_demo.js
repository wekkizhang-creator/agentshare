const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "deliverables");
const screenDir = path.join(root, "video_assets", "demo_screens");
const voiceDir = path.join(root, "video_assets", "voice_chunks");
const videoPath = path.join(outDir, "wps_agent_demo_with_voice.avi");
const subtitlePath = path.join(outDir, "wps_agent_demo_with_voice.srt");

const width = 1920;
const height = 1080;
const fps = 2;

const cues = [
  ["WPS Agent共享平台是一个垂直 Agent 双边市场，给专业问题专业答案。"],
  ["用户来这里找懂行的 Agent，创作者把行业 know-how 变成生意。"],
  ["先从用户视角看，这是 Agent 市场首屏。"],
  ["Agent 按专业领域组织，法律、电商、医疗、财税、教育、设计等场景都能找到。"],
  ["每个 Agent 都标了评分、调用量、价格、试用次数，一眼判断好不好用。"],
  ["详情页有版本、用户量、精选案例和评分分布，选之前心里有数。"],
  ["先试用、再付费，不合适随时换，几乎没有试错成本。"],
  ["看三个具体场景，都是没有垂直知识就做不了的事。"],
  ["合同审查：通用 AI 会漏掉条款陷阱；法律 Agent 接了类案数据库，逐条标风险。"],
  ["法律文书：通用 AI 套个模板就交差；法律 Agent 按地方法院格式起草，改完就能用。"],
  ["电商选品：通用 AI 凭印象推荐；选品 Agent 拉得到销量、退货率和竞品价格，推的是数据。"],
  ["通用 AI 像一个聪明的实习生，垂直 Agent 是一个干过十年的老手。"],
  ["创作者把多年的实战经验沉淀成产品。"],
  ["按次付费，不订阅、不绑定，用一次扣一次积分。"],
  ["不用先充一整年会员才能试。"],
  ["这是对用户最公平的方式。"],
  ["现在翻到另一面，这些专业 Agent 从哪里来？"],
  ["如果你在一个行业里有积累，可以从零搭建一个 Agent。"],
  ["描述你的专业能力、目标用户、典型问题，几分钟出雏形。"],
  ["全程零代码，人设、知识库、工具调用，平台一步步带你做。"],
  ["律师、会计、医生、电商运营，任何行业里干了多年的人，都能把经验做成 Agent。"],
  ["沙箱试跑没问题，就能上架到市场，让全国有这个需求的人都找得到你。"],
  ["如果你已经在其他平台做过 Agent，也可以直接搬过来。"],
  ["Coze、Dify、ChatGPT GPTs、GitHub、Markdown，一键导入，不用重做。"],
  ["你在外部积累的内容，直接进入 WPS Agent共享平台的商业化体系。"],
  ["还有一种方式，把你正在用的智能体直接绑定进来。"],
  ["复制一段授权指令贴出去，智能体回传授权码，接入完成。"],
  ["你在外部积累的用户和口碑，跟着 Agent 一起带过来。"],
  ["自建、导入、绑定三条路径，让创作者低成本把能力放上市场。"],
  ["回到用户视角，选好 Agent，进入调用工作台。"],
  ["当前 Agent、剩余试用次数、任务输入框，信息全部前置。"],
  ["右边是积分预估区，输出长度、工具调用、模型成本都提前算好。"],
  ["在你确认之前，就知道这次大概花多少积分。"],
  ["没有黑盒、没有意外，也没有用了才知道贵。"],
  ["一句话，WPS Agent共享平台是垂直 Agent 的双边市场。"],
  ["用户找到懂行的 Agent，创作者赚到该赚的钱。"],
  ["WPS Agent共享平台，找 Agent、做 Agent，都从这里开始。"],
].map(([text], index) => ({
  text,
  image: path.join(screenDir, `caption_${String(index + 1).padStart(2, "0")}.jpg`),
  wav: path.join(voiceDir, `voice_${String(index + 1).padStart(2, "0")}.wav`),
}));

function runPowerShell(text, outputPath) {
  const command = [
    "Add-Type -AssemblyName System.Speech;",
    "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer;",
    "$s.SelectVoice('Microsoft Huihui Desktop');",
    "$s.Rate = 3;",
    "$s.Volume = 100;",
    "$s.SetOutputToWaveFile($env:TTS_OUT);",
    "$s.Speak($env:TTS_TEXT);",
    "$s.Dispose();",
  ].join(" ");

  return new Promise((resolve, reject) => {
    const child = spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], {
      env: { ...process.env, TTS_TEXT: text, TTS_OUT: outputPath },
      stdio: "pipe",
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `PowerShell exited with ${code}`));
    });
  });
}

function readWav(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`${filePath} is not a WAV file`);
  }

  let offset = 12;
  let format = null;
  let data = null;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    const end = start + size;
    if (id === "fmt ") {
      format = {
        audioFormat: buffer.readUInt16LE(start),
        channels: buffer.readUInt16LE(start + 2),
        sampleRate: buffer.readUInt32LE(start + 4),
        byteRate: buffer.readUInt32LE(start + 8),
        blockAlign: buffer.readUInt16LE(start + 12),
        bitsPerSample: buffer.readUInt16LE(start + 14),
      };
    }
    if (id === "data") data = buffer.subarray(start, end);
    offset = end + (size % 2);
  }

  if (!format || !data) throw new Error(`${filePath} is missing fmt or data chunk`);
  if (format.audioFormat !== 1) throw new Error("Only PCM WAV is supported");
  return { format, data };
}

function silenceBytes(format, seconds) {
  const byteLength = Math.ceil((format.byteRate * seconds) / format.blockAlign) * format.blockAlign;
  return Buffer.alloc(byteLength);
}

async function generateVoiceChunks() {
  await fsp.mkdir(voiceDir, { recursive: true });
  for (const cue of cues) {
    await runPowerShell(cue.text, cue.wav);
  }
}

function buildTimeline() {
  const chunks = cues.map((cue) => ({ ...cue, wavData: readWav(cue.wav) }));
  const format = chunks[0].wavData.format;
  for (const chunk of chunks) {
    const next = chunk.wavData.format;
    if (
      next.channels !== format.channels ||
      next.sampleRate !== format.sampleRate ||
      next.byteRate !== format.byteRate ||
      next.blockAlign !== format.blockAlign ||
      next.bitsPerSample !== format.bitsPerSample
    ) {
      throw new Error("Voice chunks have different WAV formats");
    }
  }

  const frames = [];
  const audioParts = [];
  const srtBlocks = [];
  let currentSeconds = 0;

  chunks.forEach((chunk, index) => {
    const speechSeconds = chunk.wavData.data.length / format.byteRate;
    const cueSeconds = Math.ceil((speechSeconds + 0.45) * fps) / fps;
    const frameCount = Math.max(1, Math.round(cueSeconds * fps));
    const image = fs.readFileSync(chunk.image);
    const targetAudioBytes = Math.ceil((frameCount / fps) * format.byteRate / format.blockAlign) * format.blockAlign;
    const paddingBytes = Math.max(0, targetAudioBytes - chunk.wavData.data.length);

    for (let frame = 0; frame < frameCount; frame += 1) frames.push(image);
    audioParts.push(chunk.wavData.data, Buffer.alloc(paddingBytes));

    const start = currentSeconds;
    const end = currentSeconds + frameCount / fps;
    srtBlocks.push(`${index + 1}\n${formatTime(start)} --> ${formatTime(end)}\n${chunk.text}`);
    currentSeconds = end;
  });

  return {
    frames,
    audio: Buffer.concat(audioParts),
    format,
    srt: `${srtBlocks.join("\n\n")}\n`,
    duration: currentSeconds,
  };
}

function uint32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function int32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeInt32LE(value, 0);
  return buffer;
}

function uint16(value) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function chunk(tag, data) {
  const pad = data.length % 2 ? Buffer.from([0]) : Buffer.alloc(0);
  return Buffer.concat([Buffer.from(tag), uint32(data.length), data, pad]);
}

function listChunk(kind, data) {
  const payload = Buffer.concat([Buffer.from(kind), data]);
  const pad = payload.length % 2 ? Buffer.from([0]) : Buffer.alloc(0);
  return Buffer.concat([Buffer.from("LIST"), uint32(payload.length), payload, pad]);
}

function aviHeader(totalFrames, maxFrameSize, bytesPerAudioFrame, audioData, format, moviSize, idxSize) {
  const avih = Buffer.concat([
    uint32(Math.floor(1_000_000 / fps)),
    uint32(maxFrameSize * fps + format.byteRate),
    uint32(0),
    uint32(0x10),
    uint32(totalFrames),
    uint32(0),
    uint32(2),
    uint32(Math.max(maxFrameSize, bytesPerAudioFrame)),
    uint32(width),
    uint32(height),
    uint32(0),
    uint32(0),
    uint32(0),
    uint32(0),
  ]);

  const videoStrh = Buffer.concat([
    Buffer.from("vids"),
    Buffer.from("MJPG"),
    uint32(0),
    uint16(0),
    uint16(0),
    uint32(0),
    uint32(1),
    uint32(fps),
    uint32(0),
    uint32(totalFrames),
    uint32(maxFrameSize),
    uint32(0xffffffff),
    uint32(0),
    int32(0),
    int32(0),
    int32(width),
    int32(height),
  ]);
  const videoStrf = Buffer.concat([
    uint32(40),
    int32(width),
    int32(height),
    uint16(1),
    uint16(24),
    Buffer.from("MJPG"),
    uint32(maxFrameSize),
    int32(0),
    int32(0),
    uint32(0),
    uint32(0),
  ]);

  const audioStrh = Buffer.concat([
    Buffer.from("auds"),
    Buffer.from([0, 0, 0, 0]),
    uint32(0),
    uint16(0),
    uint16(0),
    uint32(0),
    uint32(format.blockAlign),
    uint32(format.byteRate),
    uint32(0),
    uint32(Math.floor(audioData.length / format.blockAlign)),
    uint32(bytesPerAudioFrame),
    uint32(0xffffffff),
    uint32(format.blockAlign),
    int32(0),
    int32(0),
    int32(0),
    int32(0),
  ]);
  const audioStrf = Buffer.concat([
    uint16(1),
    uint16(format.channels),
    uint32(format.sampleRate),
    uint32(format.byteRate),
    uint16(format.blockAlign),
    uint16(format.bitsPerSample),
  ]);

  const hdrl = listChunk(
    "hdrl",
    Buffer.concat([
      chunk("avih", avih),
      listChunk("strl", Buffer.concat([chunk("strh", videoStrh), chunk("strf", videoStrf)])),
      listChunk("strl", Buffer.concat([chunk("strh", audioStrh), chunk("strf", audioStrf)])),
    ]),
  );
  const riffSize = 4 + hdrl.length + 8 + moviSize + idxSize;
  return Buffer.concat([Buffer.from("RIFF"), uint32(riffSize), Buffer.from("AVI "), hdrl]);
}

async function writeAvi({ frames, audio, format }) {
  const maxFrameSize = Math.max(...frames.map((frame) => frame.length));
  const bytesPerAudioFrame = Math.ceil(format.byteRate / fps / format.blockAlign) * format.blockAlign;
  const paddedAudioLength = frames.length * bytesPerAudioFrame;
  const audioData = audio.length >= paddedAudioLength ? audio.subarray(0, paddedAudioLength) : Buffer.concat([audio, Buffer.alloc(paddedAudioLength - audio.length)]);

  const moviPayloadSize = frames.reduce((sum, frame) => sum + 8 + frame.length + (frame.length % 2) + 8 + bytesPerAudioFrame + (bytesPerAudioFrame % 2), 0);
  const moviSize = 4 + moviPayloadSize;
  const idxSize = 8 + frames.length * 2 * 16;

  const output = fs.createWriteStream(videoPath);
  output.write(aviHeader(frames.length, maxFrameSize, bytesPerAudioFrame, audioData, format, moviSize, idxSize));
  output.write(Buffer.from("LIST"));
  output.write(uint32(moviSize));
  output.write(Buffer.from("movi"));

  let offset = 4;
  const indexEntries = [];
  for (let index = 0; index < frames.length; index += 1) {
    const frame = frames[index];
    const audioChunk = audioData.subarray(index * bytesPerAudioFrame, (index + 1) * bytesPerAudioFrame);

    output.write(Buffer.from("00dc"));
    output.write(uint32(frame.length));
    output.write(frame);
    if (frame.length % 2) output.write(Buffer.from([0]));
    indexEntries.push(Buffer.concat([Buffer.from("00dc"), uint32(0x10), uint32(offset), uint32(frame.length)]));
    offset += 8 + frame.length + (frame.length % 2);

    output.write(Buffer.from("01wb"));
    output.write(uint32(audioChunk.length));
    output.write(audioChunk);
    if (audioChunk.length % 2) output.write(Buffer.from([0]));
    indexEntries.push(Buffer.concat([Buffer.from("01wb"), uint32(0x10), uint32(offset), uint32(audioChunk.length)]));
    offset += 8 + audioChunk.length + (audioChunk.length % 2);
  }

  output.write(chunk("idx1", Buffer.concat(indexEntries)));
  await new Promise((resolve) => output.end(resolve));
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

async function main() {
  await fsp.mkdir(outDir, { recursive: true });
  await generateVoiceChunks();
  const timeline = buildTimeline();
  await writeAvi(timeline);
  await fsp.writeFile(subtitlePath, timeline.srt, "utf8");
  console.log(`wrote ${videoPath}`);
  console.log(`wrote ${subtitlePath}`);
  console.log(`duration ${timeline.duration.toFixed(1)}s, resolution ${width}x${height}, fps ${fps}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
