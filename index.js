import { randomBytes } from 'crypto'
import * as fs from 'fs/promises'
import bench from 'nanobench'
import Hypercore from 'hypercore'
import ram from 'random-access-memory'
import b4a from 'b4a'
import protobuf from 'protobufjs'

import { encode } from './lib/compact.js'

// remove whitespace from json (silly but 🤷‍♂️)
const exampleJson = JSON.stringify(JSON.parse((await fs.readFile('./lib/example.json', 'utf8'))))
const example = JSON.parse(exampleJson)
const { nested: { Observation } } = await protobuf.load('./lib/schema.proto')

bench('json 5000', async (b) => {
    const core = new Hypercore(ram, {
        valueEncoding: 'json'
    })

    b.start()
    for (let i = 0; i < 5000; i++) {
        await core.append(example)
    }
    b.end()

    const info = await core.info()
    console.log('json core byteLength', info.byteLength, '\n\n')
})

bench('json stored as buffers 5000', async (b) => {
    const core = new Hypercore(ram)

    b.start()
    for (let i = 0; i < 5000; i++) {
        const buffer = b4a.from(exampleJson)
        await core.append(buffer)
    }
    b.end()

    const info = await core.info()
    console.log('json buffers core byteLength', info.byteLength, '\n\n')
})

bench('protocol buffers 5000', async (b) => {
    const core = new Hypercore(ram)

    b.start()
    for (let i = 0; i < 5000; i++) {
        const message = Observation.fromObject(example)
        const buffer = Observation.encode(message).finish()
        await core.append(buffer)
    }
    b.end()

    const info = await core.info()
    console.log('protocol buffers 5000 core byteLength', info.byteLength, '\n\n')
})

bench('compact encoding 5000', async (b) => {
    const core = new Hypercore(ram)

    b.start()
    for (let i = 0; i < 5000; i++) {
        const buffer = encode(example)
        await core.append(buffer)
    }
    b.end()

    const info = await core.info()
    console.log('compact encoding 5000 core byteLength', info.byteLength, '\n\n')
})

bench('protocol buffers 5000 with prefix', async (b) => {
    const core = new Hypercore(ram)
    const prefix = randomBytes(32)

    b.start()
    for (let i = 0; i < 5000; i++) {
        const message = Observation.fromObject(example)
        const buffer = Buffer.concat([
            prefix,
            Observation.encode(message).finish()
        ])
        await core.append(buffer)
    }
    b.end()

    const info = await core.info()
    console.log('protocol buffers 5000 with prefix core byteLength', info.byteLength, '\n\n')
})
