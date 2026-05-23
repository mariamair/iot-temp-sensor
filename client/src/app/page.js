/**
 * Defines the home page.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import styles from './page.module.css'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [isOn, setIsOn] = useState(false)

  const handleClick = async () => {
    const command = !isOn ? 'on' : 'off'

    try {
      const response = await fetch('/api/led', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
      })

      const data = await response.json()

      if (data.success) {
        setIsOn(!isOn)
      }
    } catch (error) {
      console.error('Failed to toggle led light', error)
    }
  }
  
  const buttonClass = `${styles.toggleButton} ${isOn ? styles.isOn : ''}`

  return (
    <main className={styles.main}>
    
      <div className={styles.container}>
        <h1>IoT project</h1>
        <p className={styles.text}>Toggle the led light or display a Grafana snapshot of the sensor data.</p>
        <div className={styles.buttonContainer}>
          <div className={styles.card}>
            <label>Led</label>
            <button
              className={buttonClass}
              onClick={handleClick}>
              <div className={styles.thumb}></div>
            </button>
          </div>
          <div className={styles.card}>
            <label>Sensor data</label>
            <a target="_blank" href="https://grafana.mariamair.se/dashboard/snapshot/EGSRvBfjK06ElWEGCiPVOysH48fwfpVD">Open snapshot</a>
          </div>
        </div>
      </div>

      <Image
        src="/iot-hardware.png"
        alt="IoT hardware with sensor and led"
        width={300}
        height={300}
        loading="eager"
        className={styles.image}/>
      <div className={styles.list}>
        <h3>Hardware setup</h3>
        <ul>
          <li>Raspberry Pi Pico W</li>
          <li>Led light</li>
          <li>DHT22 temperature and humidity sensor</li>
        </ul>
      </div>

    </main>
  )
}
