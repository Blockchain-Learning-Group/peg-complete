const argv = require('yargs')
.option('hub', { description: 'Hub contract address to interface with.', type: 'string' })
.argv

const contract = require('truffle-contract')
const Web3 = require('web3')
const hubArtifacts = require('../../build/contracts/StaticHub.json')

// Web3 init and account setup
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const authenticatedAccount = web3.eth.accounts[1] // the account that has been added to the blg hub

// Hub
const StaticHub = contract(hubArtifacts)
StaticHub.setProvider(web3.currentProvider)
let staticHub

initPeg()

/**
 * Initialize an interface with the deployed hub.
 */
async function initPeg () {
  if (!web3.isConnected()) throw 'Web3 is not connected!';

  if (argv.hub) {
    staticHub = await StaticHub.at(argv.hub)
    console.log('Hub Initd')
  }
}

/**
 * Add a new resource to the BLG hub.
 * @param {String} resourceUrl The url to be added.
 */
async function addResource(resourceUrl) {
  const callResponse = await staticHub.addResource.call(
    resourceUrl,
    { from: authenticatedAccount }
  )

  if (callResponse) {
    const tx = await staticHub.addResource(
      resourceUrl,
      {
        from: authenticatedAccount,
        gas: 4e6
      }
    )

    return tx

  } else return false
}

module.exports = {
  addResource,
}
