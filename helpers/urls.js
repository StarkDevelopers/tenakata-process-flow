module.exports = {
  'AUTHENTICATION': '/ussd_login?phone=[PHONE_NUMBER]&country_code=[COUNTRY_CODE]',
  'SALES': '/ussd_dailysale_purchases?user_id=[USER_ID]&sales_purchases=[SALES_OR_PURCHASE]' +
    '&date=[DATE]&amount=[AMOUNT]&item_list=[DETAILS]&payment_type=[PAYMENT_TYPE]&id_no=[DESCRIPTION]',
  'MONEY_OUT': '/ussd_dailysale_purchases?user_id=[USER_ID]&sales_purchases=[SALES_OR_PURCHASE]' +
    '&date=[DATE]&amount=[AMOUNT]&item_list=[DETAILS]&payment_type=[PAYMENT_TYPE]&id_no=[DESCRIPTION]&name=[DESCRIPTION_TYPE]',

  // TODO: Add Reports API Here
  'REPORTS': {
     'MY_PROFIT':'/profit_loss_report_ussd?business_id=[BUSINESS_ID]&frequency=[FREQUENCY]'
  },
  'REFER_A_FRIEND':'/refer_a_friend?user_id=[USER_ID]&user_phone_number=[USER_PHONE_NUMBER]&referee_phone_number=[REFEREE_PHONE_NUMBER]&referee_name=[REFERE_NAME]',
  'TERMS_AND_CONDITIONS':'/terms_and_conditions?user_id=[USER_ID]&user_phone_number=[USER_PHONE_NUMBER]'
};
