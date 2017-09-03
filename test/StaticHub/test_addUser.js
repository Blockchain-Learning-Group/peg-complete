const etherUtils = require('../../utils/ether')
let callResponse
let txResponse

contract('StaticHub.addUser()', accounts => {
  const blgAccount = accounts[0]
  const user1 = accounts[1]
  const name= 'adam'
  const position = 'engineer'
  const location = 'london'

  it("should add a new user to the hub.", async () => {
    const hubAndBlgContracts = await etherUtils.deployHub(blgAccount)
    const staticHub = hubAndBlgContracts[0]

    callResponse = await staticHub.addUser.call(user1, name, position, location, { from: blgAccount })
    txResponse = await staticHub.addUser(user1, name, position, location, { from: blgAccount })

    // Assert after tx so we can see the emitted logs in the case of failure.
    assert(callResponse, 'Call response was not true.')

    const eventLog = txResponse.logs[0]
    assert.equal(eventLog.event, 'LogUserAdded', 'LogResourceAdded event was not emitted.')
    assert.equal(eventLog.args.user, user1, 'Incorrect user was emitted.')
  })

  it("should return false and emit LogErrorString when not from blg.", async () => {
    const hubAndBlgContracts = await etherUtils.deployHub(blgAccount)
    const staticHub = hubAndBlgContracts[0]

    callResponse = await staticHub.addUser.call(user1, name, position, location, { from: user1 })
    txResponse = await staticHub.addUser(user1, name, position, location, { from: user1 })

    // Assert after tx so we can see the emitted logs in the case of failure.
    assert(!callResponse, 'Call response was not false.')

    // Event emission
    const eventLog = txResponse.logs[0]
    assert.equal(eventLog.event, 'LogErrorString', 'LogErrorString event was not emitted.')
    const errorString = eventLog.args.errorString;
    assert.notEqual(errorString.indexOf('msg.sender != blg'), -1, "Incorrect error message: " + errorString)
  })

  it("should return false and emit LogErrorString when user already exists.", async () => {
    const hubAndBlgContracts = await etherUtils.deployHub(blgAccount)
    const staticHub = hubAndBlgContracts[0]

    await staticHub.addUser(user1, name, position, location, { from: blgAccount })

    callResponse = await staticHub.addUser.call(user1, name, position, location, { from: blgAccount })
    txResponse = await staticHub.addUser(user1, name, position, location, { from: blgAccount })

    // Assert after tx so we can see the emitted logs in the case of failure.
    assert(!callResponse, 'Call response was not false.')

    // Event emission
    const eventLog = txResponse.logs[0]
    assert.equal(eventLog.event, 'LogErrorString', 'LogErrorString event was not emitted.')
    const errorString = eventLog.args.errorString;
    assert.notEqual(errorString.indexOf('User already exists'), -1, "Incorrect error message: " + errorString)
  })
})
