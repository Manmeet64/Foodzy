import admin from "firebase-admin";

// Make sure to replace 'serviceAccount' with the actual path to your Firebase service account JSON key
const serviceAccount = {
    type: "service_account",
    project_id: "fir-app-2e08c",
    private_key_id: "be9dcffd6c3d943184c7df457c901981691ef583",
    private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmE6eZoYa53sUU\nqaJYxzCh5BHPtwEgJUaQNYZiLOEwnr2LjX48BCqYhi2i16k9mmYy0bKrnGwlyQEw\nwhBWXNKk//FzMAepPbOTbK4cVfxQEWetUFE98ss8diid4lkyxy9DGL+FDWnIpzYI\nbVUzxeD3y3uMGPKIN5R6jKseUn68rqcwCX/NNcd14VlOMHe0T+rVlC4BxpR+zxdd\nnMYHMQo1LtM5SvoXHw33V1Kbw/K41WlSwPuyISbiBtIJUa/ZxVPQKxDveE4xfnrz\nZnShcwoNonG8OJrR7/+Ys771XlLITOm10XEH1RUSn2j3oZrW4b4i4TA15Qzm/rhq\nSmR6tllVAgMBAAECggEABsJ7CmZIMQ2PsQEckgd9g8FgNjepLJFH13vOPfW8rrlv\nVpxKPJAg2bdwaRXlFhRQP5ZIcvK5dipByaXEe3dovX2LathUH3/a7M+6IH4heHLU\n6PmBbQeSXSIkEhUR816nHlCGDxjWKuwfZ2Vn1+UgfIWEQFYNnRzCBuDt4ByUewKC\nE4gIHw296ighGYKRh+huJ0+g0Qrz/ww6NJPDjHvwngm7RUdlz7Q/GTrmvAjuvayf\nQpdSTcQYjqzrhTTnuJJqKPHcsFpVGv50B1JqXxSm1CECdXoe7Ao5WpGD5ZxtGtY0\nwySH9j44i4eCnIsfL+gYYepY7XKlrpyvNKsmOsHbwQKBgQDOlWbxZOxGSQoJ5hjT\nlbTMozP0MrrIHupZxkpdC2RM4q9J3CbvP1mP9biVmZjASmAWWBuDETD+n848JksC\nrP3n+9+526OIeEX76QIKzVVBCu/kb2Hbrka8oh+KsXFSVCIKRU6h08wL7YRjhZrU\n/ZaEyE4s8K9tIyHEpR3kVfuLNQKBgQDNzbqIvKhsBgRX7z/+F/zbhb8tB0I1p1Jc\nrh4kb+ywFJyujRwRdHwkX2H+IVfL7N0rg9Ph/s5w1X07tfmt8eNsFSr8ROryB8Q5\n9rlHwnSlkheZlemRAqIrhLkbowyOINXuCpxTzriuYZv9z4be5O1WboOToP9jeJZi\nPuz6axE5oQKBgBMrF7c0VxwacN0ERa90R6dpSUvSXTRuce5MkN/bS746lmszC0XN\nygCqmyr+aocFH69TE5JwyOwHZfp8zx77cD/TRioXsC/cgRnjv/XCobN8UVAP6bOZ\nkySzolubJVmvRs1PKwGnBlrg+hTF89zpfsrpTx+qYYyt4tc9Pu3N8J41AoGAQMIx\npgEnRgaGq1zfWAcYS8NEKtkT3mouIneviGunoKh7vPkuEdgDkDZrUVoQlFyOI7kx\nnPVe5GZpJ7bVQATTORlYE1VkUJBdEJgwKQJpTggwYOWpPzYC7Yqv7KBbvQVcC7FP\nC5gKyORx/2Wj3NNQU1gnEvcgJZ62Q2fljc7O9sECgYEAwvjK6NqQoA/Cqkw9iEsC\nEq+x7n0VvUcDHa+JWS0crK/yvPdll0UQqtcTj6xnbAetahkzlUM1D83XtWurmaUQ\nMbQydvdCzE75Sq4jVTCTY1C+ZBQ4mihqdiGuZm9p0IXEV7Lju6M0IQL2nHBHsHPH\nibSGlniah9nve8GigbG0ON8=\n-----END PRIVATE KEY-----\n",
    client_email:
        "firebase-adminsdk-3y7za@fir-app-2e08c.iam.gserviceaccount.com",
    client_id: "115264796463747427341",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3y7za%40fir-app-2e08c.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    admin.app(); // If already initialized, use that app
}

export default admin;
