// Copyright (c) 2018, CCMSI and contributors
// For license information, please see license.txt

frappe.ui.form.on('Daily Players', {
	refresh: function(frm) {
		var doc = frm.doc;		

		frm.set_df_property("remaining_credit", "read_only", frm.doc.__islocal?1:0);
		frm.set_df_property("allocated_credit", "read_only", frm.doc.__islocal?1:0);
		frm.set_df_property("total_credit", "read_only", frm.doc.__islocal?1:0);
		if(!frm.doc.__islocal){
			var transDate = moment(doc.fd_time_in).format("MM-DD-YYYY");

			frappe.call({
				method: 'gcms.api.gcms_get_daycard_invoices',
				args: {
					"daycard": frm.doc.daycard_id,
					"date": frm.doc.fd_time_in
				},
				callback: function(res){
					var cust = res.message;	
					console.log(cust);
					var remainingCredit = 0;
					var totalExpenses = 0;
					$.each(cust, (key, val) => {
						totalExpenses = totalExpenses + val.total;
					});
					remainingCredit = getTotalCredit(frm.doc.allocated_credit) - totalExpenses;
					frm.set_value("remaining_credit", remainingCredit == 0.00?getTotalCredit(frm.doc.allocated_credit):remainingCredit);
					invoiceSection.init($(".empty-section"), cust);
				}
			});

			frm.add_custom_button("Transactions", function(){
				frappe.route_options = {"daycard_id": doc.daycard_id, "posting_date": doc.fd_time_in};
				frappe.set_route("List", "Sales Invoice");
			}, __("View"));	

			frm.add_custom_button("Starter", function(){
				frappe.route_options = {"daycard_id": doc.daycard_id, "tee_off_time": doc.tee_off};
				frappe.set_route("List", "Starter");
			}, __("View"));	
		}

		if(frm.doc.allocated_credit){
			frm.set_value("total_credit", getTotalCredit(frm.doc.allocated_credit));
		}
	},
	is_active: (frm) => {		
		if(frm.doc.is_active){
			frm.set_df_property("fd_time_out", "read_only", 1);
			frm.set_value("fd_time_out", "");
		}else{
			frm.set_df_property("fd_time_out", "read_only", 0);
			frm.set_value("fd_time_out", frappe.datetime.now_datetime());
		}
	},
	member: (frm) => {
		if(!frm.doc.__islocal){
			frappe.call({
				method: "frappe.client.get",
				args: {
					doctype: "Members",
					name: frm.doc.member
				},
				callback: function(res){		
					frm.set_value("golfer_name", res.message.golfer_name);				
				}
			});
		}
	},
	onload_post_render: (frm) => {
		
	}
});


frappe.ui.form.on("Credit Allocation", {
	allocated_credit_add: (frm, cdt, cdn) => {
		var row = locals[cdt][cdn];
		row.daily_player = frm.doc.name;
		row.member = frm.doc.member;
		frm.refresh();
	},
	credit: (frm, cdt, cdn) => {
		var row = locals[cdt][cdn];
		frm.set_value("total_credit", getTotalCredit(frm.doc.allocated_credit));
		frm.refresh();
	}
});


var getTotalCredit = (allocatedCredit) => {
	var totalCredit = 0;
	$.each(allocatedCredit, (key, val) => {
		totalCredit += flt(val.credit);
	});
	return totalCredit;	
}

$(document).on("click", ".invoice-link", function(){
	var invoiceNum = $(this).closest("tr").data("invoice");
	invoiceSection.routeToInvoice(invoiceNum);
});

var invoiceSection = {
	init: (el, data) => {
		invoiceSection.resetInvoiceTable();

		el.removeClass("empty-section");
		el.addClass("invoice-table-section");

		var table = invoiceSection.makeTable();

		table.append(invoiceSection.makeTableHeader);
		table.append(invoiceSection.makeTableBody(data));

		$(".invoice-table-section").find(".section-body>.form-column").append(table);
	},
	makeTable: () => {
		var table = $("<table class='table table-bordered invoice-table'></table>");
		return table;
	},
	makeTableHeader: () => {
		var thead = $("<thead></thead>");
		var tr = $("<tr></tr>");
		tr.append("<th>Invoice #</th>");
		tr.append("<th>Posting Date</th>");
		tr.append("<th>Total</th>");
		thead.append(tr);
		return thead;
	},
	makeTableBody: (data) => {
		var body = $("<tbody></tbody>");		

		$.each(data, (key, val) => {
			var row = $("<tr data-invoice=" + val.name + "></tr>");
			row.append("<td><span class='invoice-link grey' style='cursor:pointer;'>" + val.name + "</span></td>");
			row.append("<td>" + val.posting_date + "</td>");
			row.append("<td>" + val.total.toFixed(2) + "</td>");
			body.append(row);
		});

		return body;
	},
	routeToInvoice: (invoiceNum) => {		
		frappe.set_route("Form", "Sales Invoice", invoiceNum);
	},
	resetInvoiceTable: () => {
		$(".invoice-table").remove();
		$(".invoice-table-section").removeClass("invoice-table-section");
		$(".invoice-table-section").addClass("empty-section");
	}
};