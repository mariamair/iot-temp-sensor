/**
 * Defines the led route.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import mqtt from 'mqtt'

// Create MQTT client outside the handler
let mqttClient = null

function getMqttClient() {
  if (mqttClient && mqttClient.connected) {
    return mqttClient
  }

  mqttClient = mqtt.connect(
    process.env.MQTT_SERVER,
    {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      rejectUnauthorized: true,
    }
  )

  mqttClient.on('connect', () => console.log('Connected to MQTT broker'))
  mqttClient.on('error', (error) => console.error('MQTT error:', error))

  return mqttClient
}

export async function POST(request) {
  const body = await request.json()
  const { command } = body

  if (!['on', 'off'].includes(command)) {
    return Response.json({ error: 'Invalid command' }, { status: 400 })
  }

  return new Promise((resolve) => {
    const client = getMqttClient()
    client.publish('mm225mz/commands/led', command, (error) => {
      if (error) {
        resolve(Response.json({ error: 'Failed to publish' }, { status: 500 }))
      } else {
        resolve(Response.json({ success: true, command }))
      }
    })
  })
}
