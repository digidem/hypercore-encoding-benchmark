import c from 'compact-encoding'
import { compile, opt } from 'compact-encoding-struct'

// could probably get smaller bytes by using nested structs rather than c.raw.json, but we also need it to be something like `raw.json` for a generic object schema
const struct = compile({
    id: c.string,
    version: c.string,
    created_at: c.string,
    timestamp: opt(c.string),
    usedId: opt(c.string),
    deviceId: opt(c.string),
    type: c.string,
    links: opt([c.string]),
    schemaVersion: c.int,
    lat: opt(c.float32),
    lon: opt(c.float32),
    metadata: opt(c.raw.json),
    refs: opt(c.raw.json),
    attachments: opt(c.raw.json),
    tags: opt(c.raw.json)
})

export function encode (message) {
    return c.encode(struct, message)
}
