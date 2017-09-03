const express = require('express')
const app = express()
const etherUtils = require('./server/ether')

app.use(express.static('client'))

// Default Home route
app.get('/', (req, res) => {
   res.sendFile( __dirname + "/client/" + "home.html" )
})

/**
 * Add a resource to the hub.
 */
app.post('/addResource/:resource', async (req, res) => {
  const response = await etherUtils.addResource(req.params.resource)
  res.send(response)
})

const server = app.listen(9191, () => {
   const host = server.address().address
   const port = server.address().port

   console.log('Server listening on port: ' + port)
})
