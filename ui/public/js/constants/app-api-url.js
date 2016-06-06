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
    GEN_CERT_CLIENT : '/gencertclient',
    GEN_CERT_SERVER : '/gencertserver',
    GEN_CERT_ADV    : '/gencertadavanced',
    GET_BASIC_CLIENT_CONF : '/getbasicclientTLSconf',
    GET_BASIC_SERVER_CONF : '/getbasicserverTLSconf',
    GET_ADV_CLIENT_CONF   : '/getadvancedclientTLSconf',
    GET_ADV_SERVER_CONF   : '/getServerTLSconf',
    SAVE_CLIENT_CONF   : '/saveclienttlsconf',
    SAVE_SERVER_CONF   : '/saveservertlsconf',
    CERT_DOWNLOAD   : '/getcert/#fname#'

};