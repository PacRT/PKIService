#! /bin/sh
openssl req -new \
    -config etc/client.conf \
    -out certs/device10.csr \
    -keyout certs/device10.key \
    -subj "/C=US/O=PacRT/OU=PacRT Hardware/CN=Device 10" \
    -passout pass:pass

openssl ca -batch \
    -config etc/tls-ca.conf \
    -in certs/device10.csr \
    -out certs/device10.crt \
    -policy extern_pol \
    -extensions client_ext \
    -passin pass:pass


openssl pkcs12 -export \
    -name "Device 10 (Network Access)" \
    -caname "PacRT TLS CA" \
    -caname "PacRT Root CA" \
    -inkey certs/device10.key \
    -in certs/device10.crt \
    -certfile ca/tls-ca-chain.pem \
    -out certs/device10.p12 \
    -passin pass:pass -passout pass:pass
