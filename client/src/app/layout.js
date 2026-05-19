/**
 * Defines the layout for the home page.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import Footer from './components/Footer.js'
import './globals.css'

export const metadata = {
  title: 'IoT project',
  description: 'Visualization of IoT sensor data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}
