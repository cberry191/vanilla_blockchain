const SHA256 = require("crypto-js/sha256")

class Block {
    constructor(timestamp, data, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash()
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block("24/12/2022", "In The Beginning...", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        // get the previous block's hash for creating the new block's hash
        newBlock.previousHash = this.getLatestBlock().hash;

        // mine new block
        newBlock.mineBlock(this.difficulty);

        // push to chain
        this.chain.push(newBlock);
    }

    validateChain() {


        // check all subsequent blocks
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // check if changes were made to block without hash being changed
            // by recalculating hash with current block data
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('Block ' + i + ' tampered with.')
                return false;
            } else(
                console.log('Block ' + i + ' data intact')
            )

            // check if this block's previous hash value actually points to previous block
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('Block ' + i + ' previous hash is invalid')
                return false;
            } else(
                console.log('Block ' + i + ' previous hash is valid')
            )
        }

        //check genesis block
        console.log('Genesis Block on record: ' + JSON.stringify(this.chain[0]))
        console.log('Genesis Block should be: ' + JSON.stringify(this.createGenesisBlock()))
        if (this.chain[0] !== this.createGenesisBlock()) {
            console.log('Genesis block tampered with')
            return false;
        }

        // if all tests pass...
        return true;
    }
}

const chrisChain = new Blockchain();

chrisChain.addBlock(new Block("25/12/2022", {
    amount: 4
}))
chrisChain.addBlock(new Block("26/12/2022", {
    amount: 10
}))

// console.log(JSON.stringify(chrisChain, null, 4))
console.log('Blockchain Valid: ' + chrisChain.validateChain());

// tamper with blockchain
chrisChain.chain[1].data = {
    amount: 100
};
chrisChain.chain[1].hash = chrisChain.chain[1].calculateHash();
console.log('Blockchain Valid: ' + chrisChain.validateChain());