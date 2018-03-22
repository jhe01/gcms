try{
	erpnext.pos.PointOfSale = erpnext.pos.PointOfSale.extend({});
}catch(e){
	class PointOfSale extends erpnext.pos.PointOfSale {
		constructor(wrapper){
			super(wrapper);
		}

		make_cart() {
			this.cart = new POSCart({
				frm: this.frm,
				wrapper: this.wrapper.find('.cart-container'),
				events: {
					on_customer_change: (customer) => this.frm.set_value('customer', customer),
					on_field_change: (item_code, field, value) => {
						this.update_item_in_cart(item_code, field, value);
					},
					on_numpad: (value) => {
						if (value == 'Pay') {
							if (!this.payment) {
								this.make_payment_modal();
							} else {
								this.frm.doc.payments.map(p => {
									this.payment.dialog.set_value(p.mode_of_payment, p.amount);
								});

								this.payment.set_title();
							}
							this.payment.open_modal();
						}
					},
					on_select_change: () => {
						this.cart.numpad.set_inactive();
					},
					get_item_details: (item_code) => {
						return this.items.get(item_code);
					},
				}
			});
			this.make_nfc_field_dom();
		}

		make_nfc_field_dom() {
			this.wrapper.find('.pos-cart').prepend('<div class="nfc-field"></div>');
			this.render_nfc_field();
		}

		render_nfc_field() {
			this.nfc_field = frappe.ui.form.make_control({
				df: {
					fieldtype: 'Link',
					label: 'NFC',
					fieldname: 'nfc_data',
					options: 'Daily Players',
					reqd: 1,
					onchange: () => {
						this.fetch_customer_info(this.nfc_field.get_value());
					},
				},
				parent: this.wrapper.find('.nfc-field'),
				render_input: true
			});
		}

		fetch_customer_info(id) {
			var me = this;
			if(id){
				frappe.call({
					method: 'gcms.api.gcms_get_customer',
					args: {
						"id": id
					},
					callback: function(res){
						var cust = res.message;
						me.cart.customer_field.set_value(cust.customer_name);
						//wrap.find('.customer-field').find('input[data-fieldname="customer"]').val(cust.customer_name);
					}
				});
			}
		}
	}
	erpnext.pos.PointOfSale = PointOfSale;
}

/*frappe.ui.form.make_control({
	df: {
		fieldtype: 'Data',
		label: 'NFC',
		fieldname: 'nfc_data',
		reqd: 1,
	},
	parent: container.find('.nfc-field'),
	render_input: true
});*/

/*class POSCart extends POSCart{
	constructor({frm, wrapper, events}) {
		this.frm = frm;
		this.item_data = {};
		this.wrapper = wrapper;
		this.events = events;
		this.make();
		this.bind_events();
	}

	make() {
		this.make_dom();
		this.make_customer_field();
		this.make_numpad();
		this.make_nfc_field();
	}

	make_nfc_field() {
		this.nfc_field = 
	}

	make_dom() {
		this.wrapper.append(`
			<div class="pos-cart">
				<div class="nfc-field">
				</div>
				<div class="customer-field">
				</div>
				<div class="cart-wrapper">
					<div class="list-item-table">
						<div class="list-item list-item--head">
							<div class="list-item__content list-item__content--flex-1.5 text-muted">${__('Item Name')}</div>
							<div class="list-item__content text-muted text-right">${__('Quantity')}</div>
							<div class="list-item__content text-muted text-right">${__('Discount')}</div>
							<div class="list-item__content text-muted text-right">${__('Rate')}</div>
						</div>
						<div class="cart-items">
							<div class="empty-state">
								<span>No Items added to cart</span>
							</div>
						</div>
						<div class="taxes-and-totals">
							${this.get_taxes_and_totals()}
						</div>
						<div class="discount-amount">`+
						(!this.frm.allow_edit_discount ? `` : `${this.get_discount_amount()}`)+
						`</div>
						<div class="grand-total">
							${this.get_grand_total()}
						</div>
					</div>
				</div>
				<div class="number-pad-container">
				</div>
			</div>
		`);
		this.$cart_items = this.wrapper.find('.cart-items');
		this.$empty_state = this.wrapper.find('.cart-items .empty-state');
		this.$taxes_and_totals = this.wrapper.find('.taxes-and-totals');
		this.$discount_amount = this.wrapper.find('.discount-amount');
		this.$grand_total = this.wrapper.find('.grand-total');

		this.toggle_taxes_and_totals(false);
		this.$grand_total.on('click', () => {
			this.toggle_taxes_and_totals();
		});
	}
}*/