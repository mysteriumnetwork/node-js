/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from "path"

import semver from "semver"

import packageJson from "../package.json"

export type OS = "win" | "mac" | "linux"
export type Arch = "x64" | "arm" | "arm64" | string
export type DownloadDescriptor = {
    os: OS
    arch: Arch
    filename: string
}

export const downloads: DownloadDescriptor[] = [
    { os: "mac", arch: "x64", filename: "myst_darwin_amd64.tar.gz" },
    { os: "mac", arch: "arm64", filename: "myst_darwin_arm64.tar.gz" },
    { os: "linux", arch: "x64", filename: "myst_linux_amd64.tar.gz" },
    { os: "linux", arch: "arm", filename: "myst_linux_arm.tar.gz" },
    { os: "win", arch: "x64", filename: "myst_windows_amd64.zip" },
]

export type Repository = (version: string, filename: string) => string

export const repositories: { [key: string]: Repository } = {
    snapshot: (version, filename) =>
        `https://github.com/mysteriumnetwork/node-builds/releases/latest/download/${filename}`,
    release: (version, filename) => `https://github.com/mysteriumnetwork/node/releases/download/${version}/${filename}`,
}

const parentDir = () => path.resolve(__dirname, "..")

export const platformToOS = (platform: NodeJS.Platform): OS => {
    switch (platform) {
        case "win32":
            return "win"
        case "darwin":
            return "mac"
        case "linux":
            return "linux"
        default:
            throw new Error(`Unsupported platform: ${platform}. Supported values: win32, darwin, linux.`)
    }
}

export const mysteriumNodeBin = (platform: NodeJS.Platform, arch: Arch) => {
    const os = platformToOS(platform)
    const executablePath = os === "win" ? "myst.exe" : "myst"
    return path.join(parentDir(), "bin", os, arch, executablePath)
}

export const mysteriumSupervisorBin = (platform: NodeJS.Platform, arch: Arch) => {
    const os = platformToOS(platform)
    const executablePath = os === "win" ? "myst_supervisor.exe" : "myst_supervisor"
    return path.join(parentDir(), "bin", os, arch, executablePath)
}

export const nodeVersion = () => semver.coerce(packageJson.version).version
