import { Crypt, RSA } from 'hybrid-crypto-js';


var publicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAx1LKcBX+r0XJL6PJvlx3
1wI3saaGuXvLoEbA4ono5ys3loSB7XHTbsIxX4Zzg+93vW3ofGcaNpwWAYHup3co
Cr6hqBQcQubOnfpOfbg0L70kVrya8uaw29UU0scPH8C6ACC7E9n5uLwbrDyEdxf5
4LUr9ZroWvoDNHM0pKqMb1Q6WP89fkCLcawqmJOAZWgaMoL3FPExd3Nj5KBg+zWt
JKKZWusEU0MFCTn4/2VvQ2dN4eR7SXq70LVM7/YYFPLd2uOzGs5Ofe3UeMmc6F2m
nCUOstUUifA3N68+TSt9kQWjtRhFnd5DNB96wO3cRS7Hx9lEfHzSs53Ph32xpFav
QO99UWHZ28OOyjthEadwjZVl9nK7+Cci7/QoTy0YCoo/LryPI0kGtkQlF0z/3slw
XpvZzVdue24jIAaEME6Rq3IHNd+7PHCDIWo8uU77N/BnmhVsEvFSMVnM5OPb9Ui+
JHdcfDhKd0D8Hb0LUgfQ58X/+g+UZ0LWqi9AlbJIFs26tncrmEInbBTMmPEDj685
WD13Gqul/nWZasC9swKa+7EN3Oxu3L1YYFltTY4zo3kJkulpNXdUCwAwoBaGfRID
cwvLOlJQ3MERSxWvzCipYdGNMKAdoP5XTcPkhKyVnD/I5dMyymLtfRTL/WfX1eVr
xakpGXh4c2c34N8xICZjZNkCAwEAAQ==
-----END PUBLIC KEY-----`;

var privateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`;

export function encrypt(message) {
    var entropy = 'Testing of RSA algorithm in javascript.';
    var crypt = new Crypt({
        rsaStandard: 'RSA-OAEP',
        entropy: entropy
    });

    var encrypted = crypt.encrypt(publicKey, message);

    var stringenc = JSON.stringify(encrypted)
    var encodedAndReady = btoa(stringenc)
    return encodedAndReady;
}

export function decrypt(message) {
    var entropy = 'Testing of RSA algorithm in javascript.';
    var crypt = new Crypt({
        rsaStandard: 'RSA-OAEP',
        entropy: entropy
    });
    var decoded = atob(message);
    var object = JSON.parse(decoded);
    var decrypted = crypt.decrypt(privateKey, object);
    console.log(decrypted);

    return decrypted.message;

    
}