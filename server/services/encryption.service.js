import forge from 'node-forge';
const { pki } = forge;

// used for sending messages to client (pair 2)
let clientPublicKey =
	'-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqqk9vzu/hzGyHrF18xz0nRMGDOdq6kkulaoOhRdKN1uDnrlxMTZj+pVDkyrac2Yt4H7NT4TwAlF43ziiEsfQ+tSBlRsmLeYqMkadSMXOa2hXg61QiBzPxVpezawF23Q9MhsPpuQohADvEr/7Z7LapM+ALnqnMUJ6mbPMnzjQYCSNMaxwumwh6a42PPkdMH9w1FyWPXybWptYpge1QRenDROp/J7ckBBmMjPL0fXcD+F5GthC+srN+t5bRp7bWqouFLZEt/bLt7UPglRS4SqlUKk1rKZD/yDp6foFP/Qfs/q8srawAm0LQ7wOxP+BaArN9OK1B2rZMaiELFoLoy0MqQIDAQAB\n-----END PUBLIC KEY-----';

//used for storing messages in db (pair 3)
let serverPublicKey =
	'-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn2fD4yJ6Zyt3rN6Q00TqhbrqzIISbpxTvi5pcMZt3Oe2h1qiPcMrgUrYcIoEljJFDwn62M5aTk/s1t2x68jIswx2cmMIi6nsp0aEwHy1yHeC83NRA5pOpP8f95dRAHWk34P6LIBM9L+9GLOK5g7AM31aZPVNcgbwrYLp2eBdTc9fL4pK+83RjjygzXRqrtQ8XVwVWxNGvn8HopN/jGRdGKUiwMms4bCEac9955APKXggz2ucQiZ7PWkUgADAovsHKr8wWs+77a9yodbbWQIxIMG+Kpf4+xjc0J78U95+pTq+WA6b7T5OHSwFg/Tpq+9xPk5OO3mbXV0JvqBDlPYnNQIDAQAB\n-----END PUBLIC KEY-----';

// used for reciving messages from client (pair 1)
let clientPrivateKey =
	'-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCwLrgwzCJH9AYhcMBgOL129crtBX6k6xZatsLU/5KYlRF23l+tirH4OVCCBPVoOZiHlOaxs+enFvIobYtkanZ+uy2ps2i34qD+UiKLSEgja3G25eAyMUCAwoTLrSAn4kxvQqNIxNIvbOXF1XszGyHSkbGcOigHViARovluVvK39fzuFnzL+YeqWFPUv0EuPic+8iR/GjUL2RUBtSFVHRb7tjxQV47HO12DakyQxhLF6fnLoYIW2jh265xb+Yx82zACVlpzW8aGPfWPtDqnDCnTCAmYDXTDZJ3i44BLtXnUBIqVS/rZRDwwAeg04EjRoYX6reKZO24ssYw8dw1vUmv7AgMBAAECggEAJtBEF8wBCWUDLL7QQuJ9KwX/TLRXMDHyXM3ConYjb6X3kP5wiaTyjELkL6C0B+AYcFYndKKzuCXf93Qar2ac8FKAPtCdk1VELoMdxR2JdvQmuyptd+FN2o///XcIjIDYYfKGUnO58mTFQg5D9ABYNTGPtWFCjEs3CWukE+Dn3ArhP33jqZEpMLTVlxhFEW/QVbG6jJcSpRCmAjv0nZ0gB3tQoNs850q2T1ID8rzF8dYyD0gnfTBw5WBQ8nNTY4vy6vSkK0kVx7KxF8my5akDbUC2ZqQfXsVDLmj+CntyN0MnEHtgOOAGrDVM5+72VHzNqZ9TZBiFsKoC86qzBXwKMQKBgQDq2shN2bcm8SkunKj8qa/7Ethr+tcrswtDeSVqjL/S0B5RBIs8+tx8oYCfhnhszYx7hd1x60heFQAxQQ6CgxDVAekyRAELOFPcWvlPrXJmAkuWEon0QZrQSa4VbFt57O1HK2qJAApbX+QjiiM63OpHyE8F0neVn7+F6mRhW1/1BwKBgQDAC5cJiygfXor8lLdVQtQkoKmxK50WiUsEBAFRsC8Qz4Kj1lCh5cSpUB9zAtfwHEAPyEMcGNjYrv4QzixvBuM91fx5bf5VleTWCFFV3mckMkEMuo42F4hyksl2lZB08zrllnLTirV4nxu6JfigPw84sU6RQK9RNOYLnDHUv+IobQKBgQCSIh5e6qifL5ILcelohgF9fcVysvtuMpNAocIZYYj+mQc0LFqjUAkf97I8EQUf1mqidbJL7zXxbKnY+/0WUo2HrQ+4ej4YCC2OQIE/BdLYDHeR4uk6NhQppJ8Qr4LgA//EuAwrQP4wyyL+xjaTquCQV+Br5AEK9gLLRgS924iCwwKBgQCERbdS0HDjIkgSbg/T/sKFM8+NAuAgjJGJg4SxEeto5bQySkOhLtOEVnZCzfuTGrIY7LMkYAzDOcwuIQNDuXe8uG076cGaizJhJLt4rEVYDfD15mxa31yQpX9zWNJ1aq3vQe92unwBR31eehbDsIs4Xg8iRm46PXgRGRTNVxhbBQKBgQDdYtYFj/6W9qQ256aN7A4bC/0TV+690BsuX0N3FeM7dOjf1nyuAO8KlIx1k+JJRiVHJatKIiv0hHPRFWNQG/skYc+LYfwapdfAmQQ1nmgb+cXuOKyM1Tr/zyYlvrqdO7EWT5Wt3pREcNJx4CCmQvr1XAei4MsOfPZM1raAnInecg==\n-----END PRIVATE KEY-----';

// used for storing messages in db (pair 3)
let serverPrivateKey =
	'-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCfZ8PjInpnK3es3pDTROqFuurMghJunFO+Lmlwxm3c57aHWqI9wyuBSthwigSWMkUPCfrYzlpOT+zW3bHryMizDHZyYwiLqeynRoTAfLXId4Lzc1EDmk6k/x/3l1EAdaTfg/osgEz0v70Ys4rmDsAzfVpk9U1yBvCtgunZ4F1Nz18vikr7zdGOPKDNdGqu1DxdXBVbE0a+fweik3+MZF0YpSLAyazhsIRpz33nkA8peCDPa5xCJns9aRSAAMCi+wcqvzBaz7vtr3Kh1ttZAjEgwb4ql/j7GNzQnvxT3n6lOr5YDpvtPk4dLAWD9Omr73E+Tk47eZtdXQm+oEOU9ic1AgMBAAECggEBAIa/yK9wrdgYvom7euGdGEMDxwgpzDsEmyXhRfC3TJe4qGuzCgL7wQMCqgQ4J7hvtkEIRqyPg3c/yQ25SnXuvPneRyJa5RZrBkpBKmctBN35aREzIgDRqDmCERvTJf4ldMIdZpXHv0YF72u6Gmhvf7oG9Sry0gzaIQoL6HLtXvIuTNE/oxR5DLb0OoRv8CF7vb6YAamdLgWfHeGbYTduqBw56RMXam28H3roGFiTJtd+btvlilFytAhFyUm2G+bQq1MlDyiHz80pbq1N9tucugzuXnGkr1xaTFKQxnR5oQQaT+QNThksdJotuIrFJk6dm/CjfV4k5bcYRn1p6znzlwECgYEAzJhtNhufPpUHfEcMfBZJXZ++Yq1WpLReMu4UNa7Pj5RdQe/XtW0IVHsGsB7zA4HvXgi1U6QS8x2n6Woa1KKmRBi210bomeEOSbRuHyX/OKrJA4qVVMC8jOIKRlDdRIdJdQLmZEZfMPZ+wd4z0gjYjeTkdTTKRYJJQrNIWxhuKAkCgYEAx3S2lm2Gz2DcMSoymo/pQG9dvjR9H90wYMWIjejk1u4cAp5MJE95b6tSFg1R5K2u9LVkE3/2J3orLxSR8Va9ca/0vpoGl0AVJWvagH1Mu0WdvIKkxsA2V+5ySh3E1W2OHwMtFlBuAOoKE7w9veZHOtKPAmKc1XL8bNqxN/xVWM0CgYEAhaVEIcYlXcIH47ydgSklv4yr1tWX9XsE1YwDk5WfbBDkYkADzjVs7ZJ3qfBtmer0q55QpFRXNIw4tRZkdGXS6kSimzlsk6gZpze/f4VYlHGrYS7ToUtNX1IAmDIWd79P0qmUSghWAiviXU2C2D6DBx1vxsg3IPScWn+2UhtBSdECgYBP2lxXcVYtpHvDez9zPfaGg4+mXOFTZny94ZfAKOOlYQL50WJujxrxKEfe6EpHIXoQIqcEX5CvUWwEl1muo6mI4Ic93/CPkWpl5v49vux/dWmnVS6fG8kl/yLmpXBuekQSCnV8n4rK9ug96nlVk+IknLQAonZjxntlIVEeNvn8aQKBgDTUc8DNq7PuJYKvF8TTHs0TynNsWF9KZg2FpC0RzOog64eRU2Dj+Bypo26iAQnRF0wXUbN6KO/kT7Cw6Lk89dIod3bdCJ9lou/F5E0qIaHtZxEtFw9yweMAMBs5z8Dpr5wVPx2lrF1EoEIWeg5flj4PqtwAYT5jcEsQRsDUQISd\n-----END PRIVATE KEY-----';

export function clientEncrypt(message) {
	// let rsa = pki.publicKeyFromPem(clientPublicKey);
	// let encrypted = btoa(rsa.encrypt(message));
	// return encrypted;

	let rsa = forge.pki.publicKeyFromPem(clientPublicKey);
	var plainTextBytes = forge.util.encodeUtf8(message);
	var encryptedBytes = rsa.encrypt(plainTextBytes);
	let encrypted = forge.util.encode64(encryptedBytes);
	return encrypted;
}

export function clientDecrypt(message) {
	// let rsa = pki.privateKeyFromPem(clientPrivateKey);
	// let decoded = atob(message);
	// let decrypted = rsa.decrypt(decoded);
	// return decrypted;

	let rsa = forge.pki.privateKeyFromPem(clientPrivateKey);
	var decodedBytes = forge.util.decode64(message);
	var decryptedBytes = rsa.decrypt(decodedBytes);
	let decoded = forge.util.decodeUtf8(decryptedBytes);
	return decoded;
}

export function serverEncrypt(message) {
	// let rsa = pki.publicKeyFromPem(serverPublicKey);
	// let encrypted = btoa(rsa.encrypt(message));
	// return encrypted;

	let rsa = forge.pki.publicKeyFromPem(serverPublicKey);
	var plainTextBytes = forge.util.encodeUtf8(message);
	var encryptedBytes = rsa.encrypt(plainTextBytes);
	let encrypted = forge.util.encode64(encryptedBytes);
	return encrypted;
}

export function serverDecrypt(message) {
	// let rsa = pki.privateKeyFromPem(serverPrivateKey);
	// let decoded = atob(message);
	// let decrypted = rsa.decrypt(decoded);
	// return decrypted;

	let rsa = forge.pki.privateKeyFromPem(serverPrivateKey);
	var decodedBytes = forge.util.decode64(message);
	var decryptedBytes = rsa.decrypt(decodedBytes);
	let decoded = forge.util.decodeUtf8(decryptedBytes);
	return decoded;
}
