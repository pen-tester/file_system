var config = {
    port_number:9400,
    mongodb_uri:"mongodb://localhost/smart_company",
    session_secretkey:'session_security',
    jwt_key_gen_code:'sec_key_jwt_generation',
    pageentry:500,
    expire_session_days:3,
    company_url:'https://www.thesmartercontact.com',
    notification_url:'http://127.0.0.1:9200'
}

module.exports = config;