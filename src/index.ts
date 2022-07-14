/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as path from "path"

import * as semver from "semver"

export type Arch = "x64" | "arm" | "arm64" | string
export type DownloadDescriptor = {
    platform: NodeJS.Platform
    arch: Arch
    filename: string
}

export const downloads: DownloadDescriptor[] = [
    { platform: "darwin", arch: "x64", filename: "myst_darwin_amd64.tar.gz" },
    { platform: "darwin", arch: "arm64", filename: "myst_darwin_arm64.tar.gz" },
    { platform: "linux", arch: "x64", filename: "myst_linux_amd64.tar.gz" },
    { platform: "linux", arch: "arm", filename: "myst_linux_arm.tar.gz" },
    { platform: "win32", arch: "x64", filename: "myst_windows_amd64.zip" },
]

export type Repository = (version: string, filename: string) => string

export const repositories: { [key: string]: Repository } = {
    snapshot: (version, filename) =>
        `https://github.com/mysteriumnetwork/node-builds/releases/latest/download/${filename}`,
    release: (version, filename) => {
        const nodeVersion = semver.coerce(version).version
        return `https://github.com/mysteriumnetwork/node/releases/download/${nodeVersion}/${filename}`
    },
}

const parentDir = () => path.resolve(__dirname, "..")

export const mysteriumNodeBin = (platform: NodeJS.Platform, arch: Arch) => {
    const bin = platform === "win32" ? "myst.exe" : "myst"
    return path.join(parentDir(), "bin", platform, arch, bin)
}

export const mysteriumSupervisorBin = (platform: NodeJS.Platform, arch: Arch) => {
    const bin = platform === "win32" ? "myst_supervisor.exe" : "myst_supervisor"
    return path.join(parentDir(), "bin", platform, arch, bin)
}
