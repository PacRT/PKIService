# PKIService

## 1.3 Create CA request¶

openssl req -new \
    -config etc/root-ca.conf \
    -out ca/root-ca.csr \
    -keyout ca/root-ca/private/root-ca.key \
    -passin pass:pass -passout pass:pass
## 1.4 Create CA certificate

openssl ca -selfsign -batch \
    -config etc/root-ca.conf \
    -in ca/root-ca.csr \
    -out ca/root-ca.crt \
    -extensions root_ca_ext \
    -enddate 20301231235959Z \
    -passin pass:pass
With the openssl ca command we create a self-signed root certificate from the CSR. The configuration is taken from the [ca] section of the root CA configuration file. Note that we specify an end date based on the key length. 2048-bit RSA keys are deemed safe until 2030 (RSA Labs).

## 1.5 Create initial CRL

openssl ca -gencrl \
    -config etc/root-ca.conf \
    -out crl/root-ca.crl \
    -passin pass:pass

With the openssl ca -gencrl command we generate an initial (empty) CRL.

# 3. Create TLS CA
## 3.1 Create directories

mkdir -p ca/tls-ca/private ca/tls-ca/db crl certs
chmod 700 ca/tls-ca/private

## 3.2 Create database

cp /dev/null ca/tls-ca/db/tls-ca.db
cp /dev/null ca/tls-ca/db/tls-ca.db.attr
echo 01 > ca/tls-ca/db/tls-ca.crt.srl
echo 01 > ca/tls-ca/db/tls-ca.crl.srl
3.3 Create CA request

openssl req -new \
    -config etc/tls-ca.conf \
    -out ca/tls-ca.csr \
    -keyout ca/tls-ca/private/tls-ca.key \
    -passout pass:pass
## 3.4 Create CA certificate

openssl ca -batch \
    -config etc/root-ca.conf \
    -in ca/tls-ca.csr \
    -out ca/tls-ca.crt \
    -extensions signing_ca_ext \
    -passin pass:pass
## 3.5 Create initial CRL

openssl ca -gencrl \
    -config etc/tls-ca.conf \
    -out crl/tls-ca.crl \
    -passin pass:pass
## 3.6 Create PEM bundle

cat ca/tls-ca.crt ca/root-ca.crt > \
    ca/tls-ca-chain.pem
# 6. Operate TLS CA
## 6.1 Create TLS server request

SAN=DNS:sensity.com,DNS:*.sensity.com \
openssl req -new \
    -config etc/server.conf \
    -out certs/sensity.com.csr \
    -keyout certs/sensity.com.key \
    -subj "/C=US/O=Sensity Systems/CN=*.sensity.com"

## 6.2 Create TLS server certificate

openssl ca -batch \
    -config etc/tls-ca.conf \
    -in certs/sensity.com.csr \
    -out certs/sensity.com.crt \
    -extensions server_ext \
    -passin pass:pass
## 6.3 Create PKCS#12 bundle

openssl pkcs12 -export \
    -name "sensity.com (Network Component)" \
    -caname "Sensity TLS CA" \
    -caname "Sensity Root CA" \
    -inkey certs/sensity.com.key \
    -in certs/sensity.com.crt \
    -certfile ca/tls-ca-chain.pem \
    -out certs/sensity.com.p12 \
    -passin pass:pass -passout pass:pass
## 6.4 Create TLS client request

openssl req -new \
    -config etc/client.conf \
    -out certs/device10.csr \
    -keyout certs/device10.key \
    -subj "/C=US/O=Sensity/OU=Sensity Hardware/CN=Device 10" \
    -passout pass:pass
## 6.5 Create TLS client certificate

openssl ca -batch \
    -config etc/tls-ca.conf \
    -in certs/device10.csr \
    -out certs/device10.crt \
    -policy extern_pol \
    -extensions client_ext \
    -passin pass:pass

## 6.6 Create PKCS#12 bundle

openssl pkcs12 -export \
    -name "Device 10 (Network Access)" \
    -caname "Sensity TLS CA" \
    -caname "Sensity Root CA" \
    -inkey certs/device10.key \
    -in certs/device10.crt \
    -certfile ca/tls-ca-chain.pem \
    -out certs/device10.p12 \
    -passin pass:pass -passout pass:pass


## Revocation 

openssl ca \
    -config etc/tls-ca.conf \
    -revoke certs/device03.pem \
    -crl_reason affiliationChanged
// CRL db needs to be updated 
openssl ca -gencrl     -config etc/tls-ca.conf     -out crl/tls-ca.crl     -passin pass:pass

openssl ca -gencrl     -config etc/root-ca.conf     -out crl/root-ca.crl     -passin pass:pass

### Check revocation status 
openssl crl -in crl/root-ca.crl -text -noout 

### Generate CRLs for self-signed certificates 
openssl ca -gencrl -keyfile ca_key -cert ca_crt -out my_crl.pem

## Special Note

If you have CA certificates in the certificate chain, each of them should have CRL entries, CRL check in NodeJS happens in the following ways. If you have CRL entry in your code, it should have CRLs for all CAs, any missing CRL corresponding to a CA will result to a 

openssl s_client -connect 127.0.0.1:3000 -cert ../pki-example-2/certs/barney.crt -key ../pki-example-2/certs/barney.key
