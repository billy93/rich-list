const { ethers } = require("ethers");

const INFURA_ID = ''
const provider = new ethers.providers.JsonRpcProvider(`https://erpc.xinfin.network`)
const provider2 = new ethers.providers.JsonRpcProvider(`https://arpc.xinfin.network`)

// const provider = new ethers.providers.WebSocketProvider('wss://ws.xinfin.network')
let blocks = [51359545,52359546,53359547,54359548,55359549]
// let blocks = Array.from({ length: 100000 }, (v, i) => i);
const main = async () => {
    let addresses = await getListAddresses()
    console.log(addresses)
    console.log("\n")

    for(let blockIdx=0;blockIdx<blocks.length;blockIdx++){
        let promises = []
        let block = blocks[blockIdx]
        console.log("BLOCK : ", block)
        for(let i=0; i<addresses.length;i++){
            const balance = provider2.getBalance(addresses[i], block)
            promises.push(balance)
        }
        let promisesResult = await Promise.all(promises);
        for(let i=0; i<promisesResult.length;i++){
            console.log(`${addresses[i]} (${block}) : ${promisesResult[i].toString()}`)
        }
        console.log("\n")
    }
}

async function getListAddresses(){
    let addresses = []
    let promises = []
    for(let x=0;x<blocks.length;x++){
        const block = provider.getBlockWithTransactions(blocks[x])
        promises.push(block)
    }

    let result = await Promise.all(promises);
    for(y=0;y<result.length;y++){
        const transactions = result[y].transactions;
        for(let i=0;i<transactions.length;i++){
            addresses.push(transactions[i].from)
            addresses.push(transactions[i].to)
        }
    }
    let addressUnique = [...new Set(addresses)]
    return addressUnique
}

main()

