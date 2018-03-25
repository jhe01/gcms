import frappe
from frappe import _

@frappe.whitelist()
def gcms_get_customer(id):
	daily_player = frappe.get_doc("Daily Players", id)
	member = frappe.get_doc("Members", daily_player.member)
	customer = frappe.get_doc("Customer", member.customer_id)
	return customer

@frappe.whitelist()
def gcms_get_daycard_invoices(daycard, date):
	new_date = frappe.utils.data.getdate(date)
	invoices = frappe.get_list("Sales Invoice", filters={'daycard_id': daycard, 'posting_date': new_date}, fields=['name', 'posting_date', 'daycard_id', 'total'])
	return invoices