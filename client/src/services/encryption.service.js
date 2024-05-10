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
    return decrypted.message;
    
}