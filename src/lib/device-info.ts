export interface DeviceInfo {
  device: string
  browser: string
  os: string
  screen: string
  userAgent: string
}

export interface LocationInfo {
  ip: string
  country: string
  city: string
  region: string
}

export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      device: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown',
      screen: 'Unknown',
      userAgent: 'Unknown'
    }
  }

  const userAgent = navigator.userAgent
  const screenSize = `${window.screen.width}x${window.screen.height}`
  
  // Detect browser
  let browser = 'Unknown'
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'
  else if (userAgent.includes('Opera')) browser = 'Opera'
  
  // Detect OS
  let os = 'Unknown'
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS')) os = 'iOS'
  
  // Detect device type
  let device = 'Desktop'
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    device = 'Mobile'
  } else if (/iPad|Android/i.test(userAgent)) {
    device = 'Tablet'
  }

  return {
    device,
    browser,
    os,
    screen: screenSize,
    userAgent
  }
}

export const getLocationInfo = async (): Promise<LocationInfo> => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    return {
      ip: data.ip || 'Unknown',
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown'
    }
  } catch (error) {
    console.error('Error fetching location info:', error)
    return {
      ip: 'Unknown',
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    }
  }
}
