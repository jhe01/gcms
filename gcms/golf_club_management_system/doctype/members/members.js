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
					$(cur_frm.fields_dict.photo.wrapper).find("div.missing-image").addClass("hidden");
					$(cur_frm.fields_dict.photo.wrapper).first().append("<img class='golfer-image' src=" + res.message.photo + "/>");
					cur_frm.set_value("player_class", res.message.player_class);
				}
			});
		}
	},
	onload_post_render: function(frm){
		if(frm.doc.__islocal){
			if($(".golfer-image").length > 0){
				$(".golfer-image").remove();
				$("div.missing-image").removeClass("hidden");
			}
		}
	}
});