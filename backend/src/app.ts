import WebSocket from 'ws'

let wss = new WebSocket.Server({ port: 3030 })

wss.on('connection', function connection(ws: any) {
  console.log('connect client')
})
