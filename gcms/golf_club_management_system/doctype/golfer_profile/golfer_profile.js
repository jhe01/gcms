// Copyright (c) 2018, CCMSI and contributors
// For license information, please see license.txt

frappe.ui.form.on('Golfer Profile', {
	refresh: function(frm) {
		wCam.resetWebCam();
		if(!frm.doc.__islocal){
			wCam.renderTakeImageButton();
		}
	},
	validate: function(frm){
		if(frm.doc.title)
			frm.doc.fullname = frm.doc.title + " ";

		frm.doc.fullname += frm.doc.lastname + ", " + frm.doc.firstname;

		if(frm.doc.middlename)
			frm.doc.fullname += " " + frm.doc.middlename;

		if(frm.doc.suffix_name)
			frm.doc.fullname += " " + frm.doc.suffix_name;
	},
	marital_status: function(frm){
		frm.set_df_property("spouse", "hidden", frm.doc.marital_status != "Married");
	}
});

var wCam = {
	init: function(opt){
		wCam.setCamProp();
		wCam.initCam(opt.targetEl);
	},
	setCamProp: function(){
		Webcam.set({
			width: 320,
			height: 240,			
			crop_width: 260,
			crop_height: 220,
			image_format: "jpeg",
			jpeg_quality: 90,
		});
	},
	renderCamPost: function(){
		var webCamPost = $("<div></div>");
		webCamPost.attr("id", "webCamPost");
		webCamPost.css({
			"background-color": "#fafbfc",
			"width": "320px",
			"height": "150px",
		});

		return webCamPost;		
	},
	initCam: function(el){
		Webcam.attach(el);
	},
	takeImage: function(){
		Webcam.snap(function(data_uri){
			msgprint("<img src=" + data_uri + " />  <br/>Copy this link to upload Image <br/> <input type='text' class='form-control' value=" + data_uri + "/>");
			//$("#webCamDest").append("<img src=" + data_uri + "/>");
		});
		
	},
	renderTakeImageButton: function(){
		cur_frm.add_custom_button(__("Take Image"), function(){
			var webCamPost = wCam.renderCamPost();
			var opt = {};

			opt.targetEl = "#webCamPost";
			
			$(cur_frm.fields_dict.photo.input).after(webCamPost);
			wCam.init(opt);
			wCam.removeTakeImageButton();
		});
	},
	removeTakeImageButton: function(){
		cur_frm.remove_custom_button(__("Take Image"));
		wCam.renderCaptureButton();
		wCam.renderResetButton();
	},
	renderCaptureButton: function(){
		cur_frm.add_custom_button(__("Capture Image"), function(){
			wCam.takeImage();
		});
	},
	removeCaptureButton: function(){
		cur_frm.remove_custom_button(__("Capture Image"));
	},
	renderResetButton: function(){
		cur_frm.add_custom_button(__("Reset"), function(){
			wCam.resetWebCam();
			wCam.removeCaptureButton();
			wCam.removeResetButton();
			wCam.renderTakeImageButton();
		});
	},
	removeResetButton: function(){
		cur_frm.remove_custom_button(__("Reset"));
	},
	resetWebCam: function(){
		Webcam.reset();
		$("#webCamPost").remove();
	},
};
