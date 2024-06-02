import forge from 'node-forge';
const { pki } = forge;

// used for sending messages to client (pair 2)
let clientPublicKey =
	'-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJQjaswxCLW/NhAqKW/pAfESym2lwI/EEH+eb2zSh+BEdn/LG1Ex0hXODFTA85gZxQuKBEZIvo+vbaWrXrdW9rMCAwEAAQ==\n-----END PUBLIC KEY-----';

//used for storing messages in db (pair 3)
let serverPublicKey =
	'-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIh8d5eq9q6pmYukjwqikY3AvFNyA+2lMdjwYCaoslR8TBZDFNF5s078LrleQDON24h5ctqO+qxksv1A540bTLMCAwEAAQ==\n-----END PUBLIC KEY-----';

// used for reciving messages from client (pair 1)
let clientPrivateKey =
	'-----BEGIN PRIVATE KEY-----\nMIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAmjq37s54oMI9vRxay6RxEQPbtotbvpXPogoJ8QVEJw9AFLsO+uFURyj2ht+ePAs1org1yWVSLG7/vZV+8FkVVQIDAQABAkEAhOm7n7siK/CZwkMQYFVr92zqyWtZ+mojERMztBmEvV9H2jWXzPh3tq6kRHQd652JLooFG/JcFgjF6ttXcv7xgQIhANxZcH3p8xg8Bg7HvsfoOmqN71BR6CxIPGJO0tZJVKohAiEAsy6ugdfJQjBpTDQWVVaWZ42AiwpV9ol0XISBxJObTLUCIQDNFpnzN/rBBa0FuLhDTEyCvJSPh4y3GozJW2A1fo9EwQIgN/jFGlpFzB9DRUKgF1hM81wIY2Z/I9wcNSpPPxC82mECIFc/C7hyxcS45jGkZ2C1zy+LpFXFBCBAyQ2JXDP/xJlB\n-----END PRIVATE KEY-----';

// used for storing messages in db (pair 3)
let serverPrivateKey =
	'-----BEGIN PRIVATE KEY-----\nMIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAiHx3l6r2rqmZi6SPCqKRjcC8U3ID7aUx2PBgJqiyVHxMFkMU0XmzTvwuuV5AM43biHly2o76rGSy/UDnjRtMswIDAQABAkBgZPfZ6Gcc6K+HDovwCO0f3nWjwazAlKFmBC8EXrTEMY/sZJW3j411J5nlVIDX46UbHnFJLlNo0Jk3wc64HbDBAiEA5Ji/yQfO1Ogoen0/0N2/sPEbddDjnS4Yo1pHOELT1cMCIQCY2QBFI4783I+5bb1B28gOCXLTjC1Qd6vPhXIy6cwOUQIgQrHyWsPla6bkkIBUiyr3j7d47JHqpuRZGefwGZEd3yMCIBpn0s4e+ILir8m/FaUdDRCvvTCi1OlD42C0kygMj/4hAiEAls1AAI6h6gyMxP5tiW0A2bNFC0xE76hCDPT0eWrtwf8=\n-----END PRIVATE KEY-----';

export function clientEncrypt(message) {
	let rsa = pki.publicKeyFromPem(clientPublicKey);
	let encrypted = btoa(rsa.encrypt(message));
	return encrypted;
}

export function clientDecrypt(message) {
	let rsa = pki.privateKeyFromPem(clientPrivateKey);
	let decoded = atob(message);
	let decrypted = rsa.decrypt(decoded);
	return decrypted;
}

export function serverEncrypt(message) {
	let rsa = pki.publicKeyFromPem(serverPublicKey);
	let encrypted = btoa(rsa.encrypt(message));
	return encrypted;
}

export function serverDecrypt(message) {
	let rsa = pki.privateKeyFromPem(serverPrivateKey);
	let decoded = atob(message);
	let decrypted = rsa.decrypt(decoded);
	return decrypted;
}
