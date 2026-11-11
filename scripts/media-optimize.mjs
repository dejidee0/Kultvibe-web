#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [mode, inputArgument, ...arguments_] = process.argv.slice(2);
const options = {};
for (let index = 0; index < arguments_.length; index++) {
  const key = arguments_[index];
  if (key === '--force') options.force = true;
  else if (['--name', '--poster-at', '--width'].includes(key) && arguments_[index + 1] && !arguments_[index + 1].startsWith('--')) options[key.slice(2)] = arguments_[++index];
  else throw new Error(`Unknown or incomplete option: ${key}`);
}
const slug = options.name;
if (!['video', 'image'].includes(mode) || !inputArgument || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) {
  throw new Error('Usage: media:optimize -- <input> --name <slug> --poster-at <seconds> [--force], or media:image -- <input> --name <slug> --width <pixels> [--force]');
}
const input = path.resolve(inputArgument);
if (!(await fs.stat(input)).isFile()) throw new Error('Input must be a local file');
function run(binary, args) {
  const result = spawnSync(binary, args, { encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Media command failed: ${result.stderr.slice(-3000)}`);
  return result.stdout;
}
// Fit the full frame without cropping or upscaling; pad only when necessary.
function fit(width, height) {
  return `scale=w='min(iw,${width})':h='min(ih,${height})':force_original_aspect_ratio=decrease:force_divisible_by=2,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1`;
}
let outputs;
let video;
if (mode === 'video') {
  if (options.width !== undefined) throw new Error('--width is only valid for images');
  const seconds = Number(options['poster-at']);
  if (options['poster-at'] === undefined || !Number.isFinite(seconds) || seconds < 0) throw new Error('--poster-at must be a non-negative number');
  const probe = JSON.parse(run(ffprobe.path, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', input]));
  video = probe.streams.find(stream => stream.codec_type === 'video');
  if (!video) throw new Error('Input has no video stream');
  if (seconds >= Number(probe.format.duration)) throw new Error('Poster timestamp must fall inside the clip');
  const aspect = video.display_aspect_ratio?.split(':').map(Number);
  const ratio = aspect?.length === 2 && aspect[1] ? aspect[0] / aspect[1] : video.width / video.height;
  if (Math.abs(ratio - 16 / 9) > 0.02) console.warn('Warning: input is not 16:9; the full frame will be padded, never cropped.');
  if (video.width < 1280 || video.height < 720) console.warn('Warning: input is below 1280x720; smaller content will be padded without upscaling.');
  outputs = [path.join(root, 'public/videos', `${slug}.mp4`), path.join(root, 'public/videos', `${slug}-480.mp4`), path.join(root, 'public/posters', `${slug}.webp`)];
  video = { ...video, seconds, audio: probe.streams.some(stream => stream.codec_type === 'audio') };
} else {
  if (options['poster-at'] !== undefined) throw new Error('--poster-at is only valid for video');
  const width = Number(options.width);
  if (!Number.isSafeInteger(width) || width < 1) throw new Error('--width must be a positive integer');
  outputs = [path.join(root, 'public/images', `${slug}.webp`)];
}
for (const output of outputs) {
  if (path.resolve(output) === input) throw new Error('Input and output must be different files');
  const exists = await fs.access(output).then(() => true, () => false);
  if (exists && !options.force) throw new Error(`Output already exists: ${path.relative(root, output)}. Use --force to replace it.`);
}
const suffix = `${process.pid}-${Date.now()}`;
const temporary = outputs.map(output => output.replace(/(\.[^.]+)$/, `.tmp-${suffix}$1`));
try {
  for (const output of outputs) await fs.mkdir(path.dirname(output), { recursive: true });
  if (mode === 'video') {
    const common = ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y'];
    run(ffmpeg, [...common, '-i', input, '-map', '0', '-c', 'copy', '-movflags', '+faststart', temporary[0]]);
    const audio = video.audio ? ['-map', '0:a:0', '-c:a', 'aac', '-b:a', '96k'] : ['-an'];
    run(ffmpeg, [...common, '-i', input, '-map', '0:v:0', ...audio, '-vf', fit(854, 480), '-c:v', 'libx264', '-profile:v', 'main', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', temporary[1]]);
    run(ffmpeg, [...common, '-ss', String(video.seconds), '-i', input, '-frames:v', '1', '-vf', fit(1280, 720), '-c:v', 'libwebp', '-quality', '82', '-compression_level', '6', temporary[2]]);
  } else {
    await sharp(input).rotate().resize({ width: Number(options.width), withoutEnlargement: true }).webp({ quality: 82 }).toFile(temporary[0]);
  }
  for (let index = 0; index < outputs.length; index++) {
    await fs.rename(temporary[index], outputs[index]);
    const stat = await fs.stat(outputs[index]);
    console.log(`${path.relative(root, outputs[index]).replaceAll('\\', '/')} ${stat.size} bytes`);
  }
} finally {
  await Promise.all(temporary.map(file => fs.unlink(file).catch(error => { if (error.code !== 'ENOENT') throw error; })));
}
