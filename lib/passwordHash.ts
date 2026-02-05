/**
 * Password hashing using Web Crypto API
 * This provides a secure way to hash passwords without exposing raw passwords
 */

// Generate a random salt
function getRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length))
}

// Convert Uint8Array to hex string
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

// Hash password using PBKDF2
async function hashPassword(password: string, salt?: Uint8Array): Promise<string> {
  const saltBytes = salt || getRandomBytes(16)
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  // Import the password key
  const key = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, [
    'deriveBits',
  ])

  // Derive the key
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256
  )

  // Combine salt and derived key
  const hashBytes = new Uint8Array(derivedKey)
  const combined = new Uint8Array(saltBytes.length + hashBytes.length)
  combined.set(saltBytes)
  combined.set(hashBytes, saltBytes.length)

  // Return as hex string
  return bytesToHex(combined)
}

// Verify password against stored hash
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Extract salt from stored hash (first 32 hex chars = 16 bytes)
    const salt = hexToBytes(storedHash.substring(0, 32))

    // Hash the provided password with the same salt
    const newHash = await hashPassword(password, salt)

    // Compare hashes
    return newHash === storedHash
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export { hashPassword, verifyPassword }
