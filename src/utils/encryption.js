const debug = false;

/**
 * 将 ArrayBuffer 转换为 PEM 格式字符串
 * @param {ArrayBuffer} buffer - 密钥数据
 * @param {string} label - PEM 标签（如 "PRIVATE KEY" 或 "PUBLIC KEY"）
 * @returns {string} PEM 格式字符串
 */
function arrayBufferToPem(buffer, label) {
  const base64Key = btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .match(/.{1,64}/g)
    .join('\n')
  return `-----BEGIN ${label}-----\n${base64Key}\n-----END ${label}-----`
}

/**
 * 生成 RSA 密钥对（PEM 格式）
 * @returns {Promise<{publicKey: string, privateKey: string}>} 公钥和私钥
 */
export async function generatePemKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign', 'verify'],
  )

  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey)
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

  return {
    pub: arrayBufferToPem(publicKey, 'PUBLIC KEY'),
    pri: arrayBufferToPem(privateKey, 'PRIVATE KEY'),
  }
}

/**
 * 使用私钥对消息生成签名
 * @param {string} message - 要签名的消息
 * @param {string} pemPrivateKey - PEM 格式的私钥
 * @returns {Promise<string>} Base64 编码的签名
 */
export async function generateSignature(message, pemPrivateKey) {
  // console.log(`pemPrivateKey: ${pemPrivateKey}`);
  // 提取 PEM 格式中的密钥
  const keyData = pemPrivateKey.replace(
    /-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g,
    '',
  )
  const privateKeyBuffer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0)).buffer

  // 导入私钥
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'RSA-PSS',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign'],
  )

  // 使用私钥签名消息
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const signature = await crypto.subtle.sign(
    {
      name: 'RSA-PSS',
      saltLength: 32,
    },
    privateKey,
    data,
  )

  // 返回 Base64 编码的签名
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

/**
 * 使用公钥加密消息
 * @param {string} message - 要加密的消息
 * @param {string} pemPublicKey - PEM 格式的公钥
 * @returns {Promise<string>} Base64 编码的加密数据
 */
export async function encryptWithPublicKey(message, pemPublicKey) {
  try {
    if (debug) console.log('开始加密消息...', message)
    // 提取 PEM 格式中的密钥
    const keyData = pemPublicKey.replace(
      /-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s+/g,
      '',
    )
    const publicKeyBuffer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0)).buffer

    // 导入公钥
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
      },
      false, // 密钥不可再次导出
      ['encrypt'],
    )

    if (debug) console.log('公钥导入成功，开始加密...')
    // 使用公钥加密消息
    const encoder = new TextEncoder()
    if (debug) console.log('准备数据')
    const data = encoder.encode(message)
    if (debug) console.log('加密', data)
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      data,
    )
    if (debug) console.log('加密成功。')

    // 返回 Base64 编码的加密数据
    const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    return encryptedBase64
  } catch (error) {
    console.error('加密失败:', error)
    console.error('出错位置: encryptWithPublicKey')
    console.error('错误详情:', error.stack)
    throw new Error(`Encryption failed: ${error.message}`)
  }
}

/**
 * 使用私钥解密数据
 * @param {string} encryptedMessage - Base64 编码的加密数据
 * @param {string} pemPrivateKey - PEM 格式的私钥
 * @returns {Promise<string>} 解密后的消息
 */
export async function decryptWithPrivateKey(encryptedMessage, pemPrivateKey) {
  try {
    if (debug) console.log('开始解密消息...')
    // 提取 PEM 格式中的密钥
    const keyData = pemPrivateKey.replace(
      /-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s+/g,
      '',
    )
    const privateKeyBuffer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0)).buffer

    // 导入私钥
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
      },
      false, // 密钥不可再次导出
      ['decrypt'],
    )

    if (debug) console.log('私钥导入成功，开始解密...')
    // 使用私钥解密数据
    const encryptedData = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0)).buffer
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      encryptedData,
    )

    // 返回解密后的消息
    const decoder = new TextDecoder()
    const decryptedMessage = decoder.decode(decrypted)
    if (debug) console.log('解密成功。')
    return decryptedMessage
  } catch (error) {
    console.error('解密失败:', error)
    console.error('出错位置: decryptWithPrivateKey')
    console.error('错误详情:', error.stack)
    throw new Error(`Decryption failed: ${error.message}`)
  }
}

/**
 * 生成随机 AES 密钥
 * @returns {Promise<CryptoKey>} AES 密钥
 */
async function generateAesKey() {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256, // 256 位密钥
    },
    true,
    ['encrypt', 'decrypt'],
  )
}

/**
 * 使用 AES 密钥加密消息
 * @param {string} message - 要加密的消息
 * @param {CryptoKey} aesKey - AES 密钥
 * @returns {Promise<{cipherText: ArrayBuffer, iv: Uint8Array}>} 加密后的数据和 IV
 */
async function encryptWithAesKey(message, aesKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 生成随机 IV
  const encoder = new TextEncoder()
  const cipherText = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    aesKey,
    encoder.encode(message),
  )
  return { cipherText, iv }
}

/**
 * 使用 AES 密钥解密数据
 * @param {ArrayBuffer} cipherText - 加密数据
 * @param {Uint8Array} iv - 加密时的 IV
 * @param {CryptoKey} aesKey - AES 密钥
 * @returns {Promise<string>} 解密后的消息
 */
async function decryptWithAesKey(cipherText, iv, aesKey) {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    aesKey,
    cipherText,
  )
  return new TextDecoder().decode(decrypted)
}

/**
 * 混合加密：用 RSA 加密 AES 密钥，用 AES 加密消息
 * @param {string} message - 要加密的消息
 * @param {string} pemPublicKey - PEM 格式的公钥
 * @returns {Promise<{encryptedKey: string, cipherText: string, iv: string}>}
 */
export async function hybridEncrypt(message, pemPublicKey) {
  try {
    if (debug) console.log('开始生成 AES 密钥...')
    const aesKey = await generateAesKey()

    if (debug) console.log('用 AES 加密消息...')
    const { cipherText, iv } = await encryptWithAesKey(message, aesKey)

    if (debug) console.log('导出 AES 密钥并用 RSA 加密...')
    const rawAesKey = await crypto.subtle.exportKey('raw', aesKey)
    const encryptedKey = await encryptWithPublicKey(
      btoa(String.fromCharCode(...new Uint8Array(rawAesKey))),
      pemPublicKey,
    )

    return {
      encryptedKey, // RSA 加密的 AES 密钥
      cipherText: btoa(String.fromCharCode(...new Uint8Array(cipherText))), // AES 加密的消息
      iv: btoa(String.fromCharCode(...iv)), // Base64 编码的 IV
    }
  } catch (error) {
    console.error('混合加密失败:', error)
    throw error
  }
}

/**
 * 混合解密：用 RSA 解密 AES 密钥，用 AES 解密消息
 * @param {string} encryptedKey - RSA 加密的 AES 密钥
 * @param {string} cipherText - AES 加密的消息
 * @param {string} iv - Base64 编码的 IV
 * @param {string} pemPrivateKey - PEM 格式的私钥
 * @returns {Promise<string>} 解密后的消息
 */
export async function hybridDecrypt(encryptedKey, cipherText, iv, pemPrivateKey) {
  try {
    if (debug) console.log('用 RSA 解密 AES 密钥...')
    const rawAesKey = new Uint8Array(
      atob(await decryptWithPrivateKey(encryptedKey, pemPrivateKey))
        .split('')
        .map((char) => char.charCodeAt(0)),
    ).buffer

    if (debug) console.log('导入 AES 密钥...')
    const aesKey = await crypto.subtle.importKey('raw', rawAesKey, { name: 'AES-GCM' }, true, [
      'decrypt',
    ])

    if (debug) console.log('用 AES 解密消息...')
    const decryptedMessage = await decryptWithAesKey(
      Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0)).buffer,
      Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)),
      aesKey,
    )

    return decryptedMessage
  } catch (error) {
    console.error('混合解密失败:', error)
    throw error
  }
}
