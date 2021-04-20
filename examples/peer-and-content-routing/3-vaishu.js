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
const fs = require('fs')
const os = require('os')

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

    const directory = 'stocks/'
    var num_users

    fs.readdir(directory, function(err, filenames) {
        console.log(filenames.length)
        // num_users is getting the number of users here
        num_users = filenames.length
        console.log(filenames)
        filenames.forEach( function (file, index) {
            var fromPath = directory+file
            fs.stat(fromPath, function(error, stat) {
                if (stat.isFile()) {
                    console.log(fromPath, " is a file!")
                    fs.readFile(directory+file, 'utf8', (err, data) => {
                        //console.log(data)
                    });
                } else if (stat.isDirectory()) {
                    console.log(fromPath, " is a directory!")
                }
            });
        });
    });

    // why is this returning undefined??
    await console.log("The num_users data type is ", typeof(num_users))
    var i
    var nodes = new Array(3)
    for(i = 0; i < 3; i++) {
        nodes[i] = await createNode()
    }

    nodes[0].peerStore.addressBook.set(nodes[1].peerId, nodes[1].multiaddrs)
    nodes[1].peerStore.addressBook.set(nodes[2].peerId, nodes[2].multiaddrs)

    await Promise.all([
        nodes[0].dial(nodes[1].peerId),
        nodes[1].dial(nodes[2].peerId)
    ])

    // vaishu's testing code
    const key = uint8ArrayFromString('APPL')
    const value = uint8ArrayFromString('Apple stock sucks right now')

    await nodes[0].contentRouting.put(key, value)

    await delay(300)

    const return_val = await (nodes[2].contentRouting.get(key, { timeout: 3000 }))
    console.log('The returned value is: ', return_val)
    console.log('The returned value is: ', uint8ArrayToString(return_val))


    // hardcoded implementation - ignore for now
    //node1.peerStore.addressBook.set(node2.peerId, node2.multiaddrs)
    //node2.peerStore.addressBook.set(node3.peerId, node3.multiaddrs)

    /*await Promise.all([
        node1.dial(node2.peerId),
        node2.dial(node3.peerId)
    ])*/

    // Wait for onConnect handlers in the DHT
    //await delay(100)


    // vaishu's testing code
    //const key = uint8ArrayFromString('APPL')
    //const value = uint8ArrayFromString('Apple stock sucks right now')


    //const key = new CID('QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnL')
    //await node2.contentRouting.put(key, value)

    //await delay(300)

    //const return_val = await (node3.contentRouting.get(key, { timeout: 3000 }))
    //console.log('The returned value is: ', return_val)
    //console.log('The returned value is: ', uint8ArrayToString(return_val))
})();
