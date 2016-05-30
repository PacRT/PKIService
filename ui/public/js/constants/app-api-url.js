/**
 * Created by Hardik on 1/19/16.
 */
module.exports = {
    API_PREFIX      : '/api/v1',
    USER_EXISTS_API : '/users/isUserExists/#userName#',
    LOG_IN          : '/login',
    SHOW_CERTS      : '/show/certificates',
    REVOKED_CERTS   : '/show/revokedcerts',
    REVOKE_CERTS    : '/revoke',
    UPLOAD_CSR      : '/uploadCSR',
    VERIFY_CSR      : '/verifycsr',
    SIGN_CSR        : '/signcsr',
    GEN_CERT_BASIC : '/gencertbasic',
    GEN_CERT_DEFAULT: '/gencertdefault',
    GEN_CERT_ADV    : '/gencertadavanced',
    GET_BASIC_CLIENT_CONF : '/getbasicclientTLSconf',
    GET_ADV_CLIENT_CONF   : '/getadvancedclientTLSconf',
    SAVE_CLIENT_CONF   : '/saveclienttlsconf',
    CERT_DOWNLOAD   : '/getcert/#fname#'

};