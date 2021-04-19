/* eslint-disable no-console */
'use strict'

const Libp2p = require('../../')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const { NOISE } = require('libp2p-noise')
const CID = require('cids')
const KadDHT = require('libp2p-kad-dht')
const uint8ArrayFromString = require('uint8arrays/from-string')
const uint8ArrayToString = require('uint8arrays/to-string')

const all = require('it-all')
const delay = require('delay')

const createNode = async () => {
        const node = await Libp2p.create({
            addresses: {
                listen: ['/ip4/0.0.0.0/tcp/0']
            },
            modules: {
                transport: [TCP],
                streamMuxer: [Mplex],
                connEncryption: [NOISE],
                dht: KadDHT
            },
            config: {
                dht: {
                    enabled: true
                }
            }
        })

        await node.start()
        return node
    }

;(async () => {
    const [node1, node2, node3] = await Promise.all([
        createNode(),
        createNode(),
        createNode()
    ])

    node1.peerStore.addressBook.set(node2.peerId, node2.multiaddrs)
    node2.peerStore.addressBook.set(node3.peerId, node3.multiaddrs)

    await Promise.all([
        node1.dial(node2.peerId),
        node2.dial(node3.peerId)
    ])

    // Wait for onConnect handlers in the DHT
    await delay(100)

    //const cid = new CID('QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnL')
    //await node1.contentRouting.provide(cid)

    //console.log('Node %s is providing %s', node1.peerId.toB58String(), cid.toBaseEncodedString())

    // wait for propagation
    //await delay(300)

    //const providers = await all(node3.contentRouting.findProviders(cid, { timeout: 3000 }))

    //console.log('Found provider:', providers[0].id.toB58String())

    // vaishu's testing code
    const key = uint8ArrayFromString('APPL')
    const value = uint8ArrayFromString('Apple stock sucks right now')


    //const key = new CID('QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnL')
    await node2.contentRouting.put(key, value)

    await delay(300)

    const return_val = await (node3.contentRouting.get(key, { timeout: 3000 }))
    console.log('The returned value is: ', return_val)
    console.log('The returned value is: ', uint8ArrayToString(return_val))


})();
