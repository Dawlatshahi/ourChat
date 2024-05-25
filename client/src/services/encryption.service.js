import { Crypt, RSA } from 'hybrid-crypto-js';
import * as forge from 'node-forge';



// pair 1
let publicKey = "-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJo6t+7OeKDCPb0cWsukcRED27aLW76Vz6IKCfEFRCcPQBS7DvrhVEco9obfnjwLNaK4NcllUixu/72VfvBZFVUCAwEAAQ==\n-----END PUBLIC KEY-----";

// pair 2
let privateKey = "-----BEGIN PRIVATE KEY-----\nMIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAlCNqzDEItb82ECopb+kB8RLKbaXAj8QQf55vbNKH4ER2f8sbUTHSFc4MVMDzmBnFC4oERki+j69tpatet1b2swIDAQABAkBGqoqEs5NjF77TgTlZID8D4CHeomY0bqQsLMkckWWt7mEIyZVKSC/7rc8mNLkslZx+j8bDvGn5jMCMVaVOs+X5AiEAw6Z9qSC4hM8g7uXZ8qL5PvgLEIbRg0U5jIPlkhgtid0CIQDB1SVWco9gSoS0pt9YI5MSxWpa64TX6hU8oWxNCEshzwIhAJZlQy9hUbX1qrE5ywHzOXmoHolDuYYZDpXvRee54jeZAiA+kjPvaCPojaWxO3010qYTlS70Ertbh/E7FVEEvPyj+QIgWxnODqNxATg+WUeiwMIzTLtzXqqcsfFlyl4bUnlwm6A=\n-----END PRIVATE KEY-----"


export function encrypt(message){
    let rsa = forge.pki.publicKeyFromPem(publicKey)
    let encrypted = btoa(rsa.encrypt(message))
    return encrypted;
}

export function decrypt(message){
    let rsa = forge.pki.privateKeyFromPem(privateKey)
    let decoded = atob(message);
    let decrypted = rsa.decrypt(decoded);
    return decrypted
}