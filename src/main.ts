import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

type Architecture = 'x86_64' | 'aarch64';
type Platform = 'windows' | 'macos' | 'linux';

interface Detect {
    platform: Platform;
    ext: string;
    method: (directory: string) => Promise<string>;
}

function detect_arch(): Architecture {
    if (process.arch === 'x64') {
        return 'x86_64';
    }

    if (process.arch === 'arm64') {
        return 'aarch64';
    }

    throw new Error(`Unsupported architecture \`${process.arch}\``);
}

function detect(): Detect {
    if (process.platform === 'win32') {
        return {platform: 'windows', ext: 'zip', method: tc.extractZip};
    }

    if (process.platform === 'darwin') {
        return {platform: 'macos', ext: 'tar.gz', method: tc.extractTar};
    }

    if (process.platform === 'linux') {
        return {platform: 'linux', ext: 'tar.gz', method: tc.extractTar};
    }

    throw new Error(`Unsupported platform \`${process.platform}\``);
}

const SUPPORTED = ['x86_64-linux', 'aarch64-macos', 'x86_64-windows'];

async function latest(token: string): Promise<string> {
    const headers: Record<string, string> = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'trug-action',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('https://api.github.com/repos/udoprog/trug/releases/latest', {headers});

    if (response.status === 404) {
        throw new Error('trug has no published release; set `version` to a tag');
    }

    if (!response.ok) {
        throw new Error(`Looking up the latest trug release failed: ${response.status} ${response.statusText}`);
    }

    const release = await response.json() as {tag_name?: string};

    if (!release.tag_name) {
        throw new Error('Latest trug release has no tag');
    }

    return release.tag_name;
}

async function download(tag: string): Promise<string> {
    const arch = detect_arch();
    const { platform, ext, method } = detect();

    if (!SUPPORTED.includes(`${arch}-${platform}`)) {
        throw new Error(`No prebuilt trug for ${arch}-${platform}; available: ${SUPPORTED.join(', ')}`);
    }

    const name = `trug-${tag}-${arch}-${platform}.${ext}`;
    const url = `https://github.com/udoprog/trug/releases/download/${tag}/${name}`;

    core.info(`Platform: ${platform}`);
    core.info(`Extension: ${ext}`);
    core.info(`Architecture: ${arch}`);
    core.info(`Name: ${name}`);
    core.info(`Url: ${url}`);

    core.info(`Downloading from ${url}`);
    const directory = await tc.downloadTool(url);
    core.info(`Extracting ${directory}`);
    return await method(directory);
}

async function innerMain() {
    let tag = core.getInput("version");

    if (!tag) {
        throw new Error("Could not determine version of trug to use");
    }

    if (tag === 'latest') {
        tag = await latest(core.getInput("token") || process.env.GITHUB_TOKEN || '');
        core.info(`Latest release is '${tag}'`);
    }

    core.info(`Downloading 'trug' from tag '${tag}'`);
    core.addPath(await download(tag));
}

async function main() {
    try {
        await innerMain();
    } catch (error) {
        // @ts-ignore
        core.setFailed(error.message);
    }
}

main();
