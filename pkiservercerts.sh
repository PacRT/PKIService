#! /bin/sh
SAN=DNS:schokkal.com,DNS:*.schokkal.com \
openssl req -new \
    -config etc/server.conf \
    -out certs/sensity.com.csr \
    -keyout certs/sensity.com.key \
    -subj "/C=US/O=Sensity Systems/CN=*.schokkal.com"

openssl ca -batch \
    -config etc/tls-ca.conf \
    -in certs/sensity.com.csr \
    -out certs/sensity.com.crt \
    -extensions server_ext \
    -passin pass:pass

openssl pkcs12 -export \
    -name "sensity.com (Network Component)" \
    -caname "Sensity TLS CA" \
    -caname "Sensity Root CA" \
    -inkey certs/sensity.com.key \
    -in certs/sensity.com.crt \
    -certfile ca/tls-ca-chain.pem \
    -out certs/sensity.com.p12 \
    -passin pass:pass -passout pass:pass

