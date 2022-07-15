/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from "path"
import fs, { mkdirSync } from "fs"

import fetch from "node-fetch"
import unzip from "extract-zip"
import targz from "targz"
import ProgressBar from "progress"
import semver from "semver"

import packageJson from "../package.json"

import { downloads, repositories } from "./index"

const unpack = async function (filename: string) {
    const destDir = path.resolve(path.dirname(filename))
    if (filename.endsWith(".zip")) {
        return unzip(filename, { dir: destDir })
    }
    return new Promise((resolve, reject) => {
        targz.decompress(
            {
                src: filename,
                dest: destDir,
            },
            (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(null)
                }
            },
        )
    })
}

async function postinstall() {
    const packageVersion = packageJson.version
    const repository = packageVersion === "0.0.0-snapshot.1" ? repositories.snapshot : repositories.release
    const nodeVersion = semver.coerce(packageVersion).version

    console.log(`Downloading Mysterium Node (${repository == repositories.release ? nodeVersion : "snapshot"})`)

    for (const download of downloads) {
        const url = repository(nodeVersion, download.filename)
        const res = await fetch(url)
        if (res.status == 404) {
            console.error("File not found")
            continue
        }
        const contentLength = parseInt(res.headers.get("Content-Length"), 10)
        const bar = new ProgressBar(`${download.platform}/${download.arch} \t :bar :percent \t ETA: :etas`, {
            complete: "█",
            incomplete: "░",
            width: 40,
            total: contentLength,
        })
        const filename = await new Promise<string>((resolve, reject) => {
            const destDir = path.join("bin", download.platform, download.arch)
            mkdirSync(destDir, { recursive: true })
            const destPath = path.join(destDir, download.filename)
            const dest = fs.createWriteStream(destPath)
            res.body.pipe(dest)
            res.body.on("data", (chunk) => {
                bar.tick(chunk.length)
            })
            res.body.on("end", () => resolve(destPath))
            dest.on("error", reject)
        })
        await unpack(filename)
        fs.unlinkSync(filename)
    }
}

postinstall()
