import { Crypt, RSA } from 'hybrid-crypto-js';


var clientPublicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmQU/f4+dJsv5RlhyHxcR
bciDrzWvPZnRo5JI8znIPDysZHj90rwD8wrGZ+7V79o5ywlpEbgBgacWb/mH3jqy
wxBZ+hOTKf+9WYQv+mCOiEsFGM1xLHkztHotEj6Ky6CvswfgA80lQ2lLXc00fGsB
pt8pdYPwTkBMy3nXYTwsysuRlLq9cKmtV0CwEsubMzET0C0wLQC9OytiV5hdVAR+
flKf80fD8RAGdhGbAjpq0karsfQNzjNZB+Gi5I6SEQkMzG0sNDGJZ+caFRNR2/i8
Lr5HqnoQg7X1k+umVYfDcknXYeBEq7AB63To4opep0o60V/x43PXjrr+u4hgM4oz
ZuGRqjasMnRSyfSJLz5AuDcpFg5HfpYF47Gx7JUhhTCGDYtivGYnGIuhTxRVqqfT
UB20qd55IxCyHGgQ/qZeiCBlFKr5zoBMpv4L3rXZoIFwmG5mHHxmUIczToQKaxus
OTwdwRpcx1sqv+p6IuJC6Bsb9d7FMUDynLJjHevVGyNLHy8R7CSTGpn29x0XBYA9
NrfFOZPPX4xnXj3rNiPNIrMvOt/uLkV44K23KIlHNmJP1bax+qwhWsLuxVlcKE6r
sfpg2cz6wCS1DydBfoIGudYzOhIjB6emcX+DSlB0wKOJhOapZqK7DBlsFk5rMUbY
ljW1/m+dae/6vtfF41RZa5UCAwEAAQ==
-----END PUBLIC KEY-----`;

var serverPublicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwxSvlmoooW7D4fnsFyHP
2BCtz8YtkfdEHzOqvsB+g1YTEF/Q0t9oOq0GgQ4NTCDECuEt1/Yi0AGF80eojGdh
tE/CNtQRMkT6qmQ7U/6f2WBGtv52usUjv8uammKbiPUJwOn9MjVnjNee+BM8Ox1l
7RhrLFpXIbSKPEt7rKvJd101oiXM1qMccGg2PIJk1Tn7nXns3TTBwuPq63ZUN79o
5WFoDlD5oPcvWa+F8pxpjJKKaqscLn4AlqaXqyZheFMbY91VSUcHAyPN6Um1o2uf
mbijso57zbF+ff5Tko9TXwoAhTes8yCW6zAOhrR8yuDCOx5KFV078ZPycR2wFv8J
ow1b7WvJjXc3i85GRu3O4/iizfsCGnooyXiYvX37TqC36NbbJz0AvSprmIkkYfRl
t5hrjkr+jghVNjiF+hcdApH5V9pfGjit5OtXT36NWNNJEGfp7JV2nTg977qmeD3N
X3deMZ+i9n5pbOLrEnhWtP9GZXn32OsfPH6a5W47Ne+gvxIRC8KjNE5xYyoQwLgR
j3YFSnP4RrInn/x06nWzXoKePkB8HIm+Z/QWm49NcN18JqCFqYgPbt/j13/rOG3w
VwxjJxEy6Ui/f/MCI+b7loBu0O7vJM12aRB80VfoPYC2oqAcfgJWq5b44YncnNpb
HCa9jKzvn7YjmaPagIx+v30CAwEAAQ==
-----END PUBLIC KEY-----`;

var clientPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`;

var serverPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`;

export function clientEncrypt(message) {
    var entropy = 'Testing of RSA algorithm in javascript.';
    var crypt = new Crypt({
        rsaStandard: 'RSA-OAEP',
        entropy: entropy
    });

    var encrypted = crypt.encrypt(clientPublicKey, message);

    var stringenc = JSON.stringify(encrypted)
    var encodedAndReady = btoa(stringenc)
    return encodedAndReady;
}

export function serverEncrypt(message) {
    var entropy = 'Testing of RSA algorithm in javascript.';
    var crypt = new Crypt({
        rsaStandard: 'RSA-OAEP',
        entropy: entropy
    });

    var encrypted = crypt.encrypt(serverPublicKey, message);

    var stringenc = JSON.stringify(encrypted)
    var encodedAndReady = btoa(stringenc)
    return encodedAndReady;
}

export function clientDecrypt(message) {
    var entropy = 'Testing of RSA algorithm in javascript.';
    var crypt = new Crypt({
        rsaStandard: 'RSA-OAEP',
        entropy: entropy
    });

    var decoded = atob(message);
    var object = JSON.parse(decoded);
    var decrypted = crypt.decrypt(clientPrivateKey, object);
    return decrypted.message;
    
}

export function serverDecrypt(message) {
    var entropy = 'Testing of RSA algorithm in javascript.';
    var crypt = new Crypt({
        rsaStandard: 'RSA-OAEP',
        entropy: entropy
    });

    var decoded = atob(message);
    var object = JSON.parse(decoded);
    var decrypted = crypt.decrypt(serverPrivateKey, object);
    return decrypted.message;
    
}