#! /bin/sh
SAN=DNS:pacrt.io,DNS:*.pacrt.io \
openssl req -new \
    -config etc/server.conf \
    -out certs/pacrt.io.csr \
    -keyout certs/pacrt.io.key \
    -subj "/C=US/O=PacRT.IO/CN=*.pacrt.io"

openssl ca -batch \
    -config etc/tls-ca.conf \
    -in certs/pacrt.io.csr \
    -out certs/pacrt.io.crt \
    -extensions server_ext \
    -passin pass:pass

openssl pkcs12 -export \
    -name "pacrt.io (Network Component)" \
    -caname "PacRT TLS CA" \
    -caname "PacRT Root CA" \
    -inkey certs/pacrt.io.key \
    -in certs/pacrt.io.crt \
    -certfile ca/tls-ca-chain.pem \
    -out certs/pacrt.io.p12 \
    -passin pass:pass -passout pass:pass

