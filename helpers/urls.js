module.exports = {
  'AUTHENTICATION': '/ussd_login?phone=[PHONE_NUMBER]&country_code=[COUNTRY_CODE]',
  'SALES': '/ussd_dailysale_purchases?user_id=[USER_ID]&sales_purchases=[SALES_OR_PURCHASE]' +
    '&date=[DATE]&amount=[AMOUNT]&item_list=[DETAILS]&payment_type=[PAYMENT_TYPE]&id_no=[DESCRIPTION]',
  'MONEY_OUT': '/ussd_dailysale_purchases?user_id=[USER_ID]&sales_purchases=[SALES_OR_PURCHASE]' +
    '&date=[DATE]&amount=[AMOUNT]&item_list=[DETAILS]&payment_type=[PAYMENT_TYPE]&id_no=[DESCRIPTION]&name=[DESCRIPTION_TYPE]'
};
