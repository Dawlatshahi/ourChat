import * as forge from 'node-forge';

// pair 1
let publicKey =
	'-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsC64MMwiR/QGIXDAYDi9dvXK7QV+pOsWWrbC1P+SmJURdt5frYqx+DlQggT1aDmYh5TmsbPnpxbyKG2LZGp2frstqbNot+Kg/lIii0hII2txtuXgMjFAgMKEy60gJ+JMb0KjSMTSL2zlxdV7Mxsh0pGxnDooB1YgEaL5blbyt/X87hZ8y/mHqlhT1L9BLj4nPvIkfxo1C9kVAbUhVR0W+7Y8UFeOxztdg2pMkMYSxen5y6GCFto4duucW/mMfNswAlZac1vGhj31j7Q6pwwp0wgJmA10w2Sd4uOAS7V51ASKlUv62UQ8MAHoNOBI0aGF+q3imTtuLLGMPHcNb1Jr+wIDAQAB\n-----END PUBLIC KEY-----';

// pair 2
let privateKey =
	'-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCqqT2/O7+HMbIesXXzHPSdEwYM52rqSS6Vqg6FF0o3W4OeuXExNmP6lUOTKtpzZi3gfs1PhPACUXjfOKISx9D61IGVGyYt5ioyRp1Ixc5raFeDrVCIHM/FWl7NrAXbdD0yGw+m5CiEAO8Sv/tnstqkz4AueqcxQnqZs8yfONBgJI0xrHC6bCHprjY8+R0wf3DUXJY9fJtam1imB7VBF6cNE6n8ntyQEGYyM8vR9dwP4Xka2EL6ys363ltGnttaqi4UtkS39su3tQ+CVFLhKqVQqTWspkP/IOnp+gU/9B+z+ryytrACbQtDvA7E/4FoCs304rUHatkxqIQsWgujLQypAgMBAAECggEBAIOdDZ+jhmvO6Z0+Isag+A0DFNFyz0NruN93TMdbVMMocnNAdIkNd0FTR9ABZoNEs/DEGbZPwYEoL92GoYd2TjaDGIRTcbhIHxay2q26zxyKVaOZT9gI0DtVHHPlTIcYN/GiaQm+P3i996IwKMSqbHBaDnLJ6JLWwBI1VYMdn6Xkh/4AtjLZZxt7VuK14OfiPncvhFI1156MHHSbpk6QVVtN9uVDNK7qR1aMkGppdZ8r2yrk0dOeGPIvXYUfCFmdhV6Yxm8igsXoVeU1LT1tze5EOI1WcMF0o53MnZGkHxfHC5hcrMy5IQ7RDe77e5BAnYsXPfnqve1J0jv45YZD6BkCgYEA1asTMZDGea1F11HYGhv31b80eYakTUaGmcqzDFBr7hzfPtqAv/DjxST7fixA1o5nuEtvlyuWaiwp59HXof4/ZRJU2IlY21NgI6lnk//kquJkYxlGidxu6GZ2UwpM6MSdZnflYQbTjaU+pEFLF0SRxxxVWm2aXaslGMCkQb/O33cCgYEAzHjov1eZguRApgBy+jJ9LhhG4Uq8F+FE9cycauRCEKCGLaBuMPPT05tywn570O/gha/FuTBsqQP1LJ0AnUBjNoQbZcKQRhyIkOQFpLNT4U65AGWSALP0hoLA5VNBUkl7aAqoRn8ruzDPTgIH+cvOIal5I4b6jdIGal5FkaZLvN8CgYAtQXviPrDbKsklLw+fkBbxLft2Vf9M4sg1oMpFrG7/0xux22Pzw5jqs8eU1Niy2Ry82zV6hl/ogwwpLrgGdqyEwto3tvecFM/DHelzXnrXevYaS0s2ffr7vGAJfKAHmUVhY7mw0FpUoRBgh/fYqMxbqPOnIJnWhx5nXL4tsuulRwKBgBXkiD8ceQJLwCRF/gmN6FtMHCK5JsSDySdsPf8v62buWQ9/kuzI3pBUn4f1lPo9BNQriscWSTwbgV/Ce7NaloTaxjgyCdKH8ZNZ5sTIsp14GVTSizxqCC9yxoaHUIIn/f+YzIWnzh3fzwJyMzpquOpfw+mq5R7UMv2mlFpQ7OEPAoGBAIfwYjcs4B/+8cQObV4jU/HYBlNGyZJvczz3VyDuo27Gzk2Jjnkcj+XLeaTBfMq1swqRzEZEjLU3rqbwXiFD5fdKEN5DPpZ7AukOxgII2p8UpkKp8Rh+RGurTq1c8LrlrHA9N52N69qHVHWXMqnhZFU/wcAAri3hi4MV1d+vzsU+\n-----END PRIVATE KEY-----';

export function encrypt(message) {
	// let rsa = forge.pki.publicKeyFromPem(publicKey)
	// let encrypted = btoa(rsa.encrypt(message))
	// return encrypted;

	let rsa = forge.pki.publicKeyFromPem(publicKey);
	var plainTextBytes = forge.util.encodeUtf8(message);
	var encryptedBytes = rsa.encrypt(plainTextBytes);
	let encrypted = forge.util.encode64(encryptedBytes);
	return encrypted;
}

export function decrypt(message) {
	// let rsa = forge.pki.privateKeyFromPem(privateKey)
	// let decoded = atob(message);
	// let decrypted = rsa.decrypt(decoded);
	// return decrypted

	let rsa = forge.pki.privateKeyFromPem(privateKey);
	var decodedBytes = forge.util.decode64(message);
	var decryptedBytes = rsa.decrypt(decodedBytes);
	let decoded = forge.util.decodeUtf8(decryptedBytes);
	return decoded;
}
