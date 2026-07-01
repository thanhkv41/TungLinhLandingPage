import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import fs from 'node:fs/promises'
import path from 'node:path'

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')
const PAGE_SIZE = 100

const DRY_RUN = process.env.DRY_RUN !== '0'
const FORCE_REUPLOAD = process.env.FORCE_REUPLOAD === '1'

function inferMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase()

  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.svg') return 'image/svg+xml'
  if (ext === '.avif') return 'image/avif'
  if (ext === '.pdf') return 'application/pdf'
  if (ext === '.mp4') return 'video/mp4'
  if (ext === '.mov') return 'video/quicktime'

  return 'application/octet-stream'
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function isBlobUrl(url?: string | null): boolean {
  return typeof url === 'string' && url.includes('.blob.vercel-storage.com/')
}

async function main() {
  const payload = await getPayload({ config })

  let page = 1
  let hasNextPage = true

  let scanned = 0
  let skippedAlreadyBlob = 0
  let skippedNoFilename = 0
  let skippedMissingLocalFile = 0
  let planned = 0
  let updated = 0
  let failed = 0

  console.log(`Media directory: ${MEDIA_DIR}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY_RUN (no write)' : 'WRITE'}`)
  console.log(`Force re-upload: ${FORCE_REUPLOAD ? 'yes' : 'no'}`)

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'media',
      depth: 0,
      limit: PAGE_SIZE,
      page,
      sort: 'id',
    })

    for (const doc of result.docs) {
      scanned++

      const filename = typeof doc.filename === 'string' ? doc.filename : ''
      const url = typeof doc.url === 'string' ? doc.url : null

      if (!filename) {
        skippedNoFilename++
        continue
      }

      if (!FORCE_REUPLOAD && isBlobUrl(url)) {
        skippedAlreadyBlob++
        continue
      }

      const localFilePath = path.join(MEDIA_DIR, filename)
      const exists = await fileExists(localFilePath)

      if (!exists) {
        skippedMissingLocalFile++
        continue
      }

      planned++

      if (DRY_RUN) {
        console.log(`[PLAN] id=${doc.id} file=${filename}`)
        continue
      }

      try {
        const buffer = await fs.readFile(localFilePath)

        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {
            alt: doc.alt || filename,
          },
          file: {
            name: filename,
            data: buffer,
            mimetype: inferMimeType(filename),
            size: buffer.byteLength,
          },
        })

        updated++
        console.log(`[OK] id=${doc.id} file=${filename}`)
      } catch (error) {
        failed++
        const message = error instanceof Error ? error.message : String(error)
        console.error(`[FAIL] id=${doc.id} file=${filename}: ${message}`)
      }
    }

    hasNextPage = result.hasNextPage
    page += 1
  }

  console.log('--- Summary ---')
  console.log(`Scanned: ${scanned}`)
  console.log(`Planned: ${planned}`)
  console.log(`Updated: ${updated}`)
  console.log(`Failed: ${failed}`)
  console.log(`Skipped (already blob): ${skippedAlreadyBlob}`)
  console.log(`Skipped (no filename): ${skippedNoFilename}`)
  console.log(`Skipped (local file missing): ${skippedMissingLocalFile}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
