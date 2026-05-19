/**
 * Defines the home page.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import styles from './page.module.css'
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
      <h1>IoT project</h1>
      <p className={styles.text}>Toggle the led light or display a Grafana snapshot of the sensor data.</p>
      <div className={styles.cardContainer}>
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
          <a target="_blank" href="https://grafana.mariamair.se/dashboard/snapshot/XL1AiMc8FpChgK8x961chGrM0ak87NfQ">Open snapshot</a>
        </div>
      </div>
    </main>
  )
}
