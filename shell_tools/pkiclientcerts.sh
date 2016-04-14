#! /bin/sh
openssl req -new \
    -config ../pki/etc/client.conf \
    -out ../pki/certs/device12.csr \
    -keyout ../pki/certs/device12.key \
    -subj "/C=US/O=PacRT/OU=PacRT Hardware/CN=Device 12" \
    -passout pass:pass

openssl ca -batch \
    -config ../pki/etc/tls-ca.conf \
    -notext \
    -in ../pki/certs/device12.csr \
    -out ../pki/certs/device12.crt \
    -cert ../pki/certs/device12.crt \
    -policy extern_pol \
    -extensions client_ext \
    -passin pass:pass


openssl pkcs12 -export \
    -name "Device 12 (Network Access)" \
    -caname "PacRT TLS CA" \
    -caname "PacRT Root CA" \
    -inkey ../pki/certs/device12.key \
    -in ../pki/certs/device12.crt \
    -certfile ../pki/ca/tls-ca-chain.pem \
    -out ../pki/certs/device12.p12 \
    -passin pass:pass -passout pass:pass
