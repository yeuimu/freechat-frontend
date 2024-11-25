/**
 * 将 ArrayBuffer 转换为 PEM 格式字符串
 * @param {ArrayBuffer} buffer - 密钥数据
 * @param {string} label - PEM 标签（如 "PRIVATE KEY" 或 "PUBLIC KEY"）
 * @returns {string} PEM 格式字符串
 */
function arrayBufferToPem(buffer, label) {
  const base64Key = btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .match(/.{1,64}/g)
    .join('\n');
  return `-----BEGIN ${label}-----\n${base64Key}\n-----END ${label}-----`;
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
    ['sign', 'verify']
  );

  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    pub: arrayBufferToPem(publicKey, 'PUBLIC KEY'),
    pri: arrayBufferToPem(privateKey, 'PRIVATE KEY'),
  };
}

/**
 * 使用私钥对消息生成签名
 * @param {string} message - 要签名的消息
 * @param {string} pemPrivateKey - PEM 格式的私钥
 * @returns {Promise<string>} Base64 编码的签名
 */
export async function generateSignature(message, pemPrivateKey) {
  console.log(`pemPrivateKey: ${pemPrivateKey}`);
  // 提取 PEM 格式中的密钥
  const keyData = pemPrivateKey
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
  const privateKeyBuffer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0)).buffer;

  // 导入私钥
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'RSA-PSS',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign']
  );

  // 使用私钥签名消息
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const signature = await crypto.subtle.sign(
    {
      name: 'RSA-PSS',
      saltLength: 32,
    },
    privateKey,
    data
  );

  // 返回 Base64 编码的签名
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
