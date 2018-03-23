// Copyright (c) 2018, CCMSI and contributors
// For license information, please see license.txt

frappe.ui.form.on('Members', {
	refresh: function(frm) {
		if(frm.doc.golfer_profile){
			frappe.call({
				method: "frappe.client.get",
				args: {
					doctype: "Golfer Profile",
					name: frm.doc.golfer_profile
				},
				callback: function(res){
					console.log(res);		
					frm.set_value("photo", res.message.photo);							
				}
			});
		}
	},
	onload_post_render: function(frm){
		
	},
	golfer_profile: function(frm){
		frappe.call({
			method: "frappe.client.get",
			args: {
				doctype: "Golfer Profile",
				name: frm.doc.golfer_profile
			},
			callback: function(res){				
				cur_frm.set_value("player_class", res.message.player_class);
				cur_frm.set_value("golfer_name", res.message.fullname);
			}
		});
	}
});