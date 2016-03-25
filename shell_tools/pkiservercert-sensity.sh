#! /bin/sh
SAN=DNS:sensity.com,DNS:*.sensity.com \
openssl req -new \
    -config ../pki/etc/server.conf \
    -out ../pki/certs/sensity.com.csr \
    -keyout ../pki/certs/sensity.com.key \
    -subj "/C=US/O=Sensity Systems/CN=*.sensity.com"

openssl ca -batch \
    -config ../pki/etc/tls-ca.conf \
    -notext \
    -in ../pki/certs/sensity.com.csr \
    -out ../pki/certs/sensity.com.crt \
    -extensions server_ext \
    -passin pass:pass

openssl pkcs12 -export \
    -name "sensity.com (Network Component)" \
    -caname "Sensity TLS CA" \
    -caname "Sensity Root CA" \
    -inkey ../pki/certs/sensity.com.key \
    -in ../pki/certs/sensity.com.crt \
    -certfile ../pki/ca/tls-ca-chain.pem \
    -out ../pki/certs/sensity.com.p12 \
    -passin pass:pass -passout pass:pass

