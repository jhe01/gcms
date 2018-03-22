import frappe
from frappe import _

@frappe.whitelist()
def gcms_get_customer(id):
	daily_player = frappe.get_doc("Daily Players", id)
	member = frappe.get_doc("Members", daily_player.member)
	customer = frappe.get_doc("Customer", member.customer_id)
	return customer