// Copyright (c) 2018, CCMSI and contributors
// For license information, please see license.txt

frappe.ui.form.on('Daily Players', {
	refresh: function(frm) {
		if(!frm.doc.__islocal){
			console.log(frm.doc.fd_time_in);
			frappe.call({
				method: 'gcms.api.gcms_get_daycard_invoices',
				args: {
					"daycard": frm.doc.daycard_id,
					"date": frm.doc.fd_time_in
				},
				callback: function(res){
					var cust = res.message;				
					console.log(res);
				}
			});
		}
	}
});
