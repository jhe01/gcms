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
		
		if(frm.doc.firstname)
			frm.doc.fullname += frm.doc.firstname		

		if(frm.doc.middlename)
			frm.doc.fullname += " " + frm.doc.middlename;

		if(frm.doc.lastname)
			frm.doc.fullname += " " + frm.doc.lastname

		if(frm.doc.suffix_name)
			frm.doc.fullname += ", " + frm.doc.suffix_name;
	},
	marital_status: function(frm){
		frm.set_df_property("spouse", "hidden", frm.doc.marital_status != "Married");
	}
});

var wCam = {
	init: function(opt){
		wCam.setCamProp();
		//wCam.initCam(opt.targetEl);
	},
	camProp: {		
		width: 320,
		height: 280,
		crop_width: 280,
		crop_height: 260,
		image_format: "jpeg",
		jpeg_quality: 90,
	},
	setCamProp: function(){
		
		$(document).on("shown.bs.modal", "div.modal", function(){
			$(this).addClass("mdl-capture");
			var width = $(".colm").width();
			var height = $(".colm").height();
			wCam.camProp.dest_height = 360;
			wCam.camProp.dest_width = 360;

			Webcam.set(wCam.camProp);

			wCam.initCam("#webCamPost");
		});
		
		
	},
	renderCamPost: function(){
		var col = "<div class='col-md-6 colm'><h4>Camera</h4><div id='webCamPost' style='width:240px;height:240px;'></div>"
			+ "</div><div class='col-md-6 colm'><h4>Result</h4><div id='setImage'></div></div>";

		var row = "<div class='row' id='camPost'>" + col + "</div><br/>"
			+ "<p>Copy this to upload image: </p><input type='text' class='form-control' id='inputImage'/> <br/>"
			+ "<button class='btn btn-primary btn-sm' id='btnCapture'>Capture</button>";
		msgprint(row);
		var opt = {};

		opt.targetEl = "#webCamPost";
		wCam.init(opt, "Take a Photo");

	},
	initCam: function(el){
		Webcam.attach(el);
		 //Webcam.attach(".sidebar-image-wrapper");
	},
	takeImage: function(){
		Webcam.snap(function(data_uri){
			$("#setImage").html("");
			$("#setImage").append("<img class='img-responsive thumbnail captured' src=" + data_uri + "/>");
						
			$("#inputImage").val(data_uri);
		});
		
	},

	renderTakeImageButton: function(){
		cur_frm.add_custom_button(__("Take Image"), function(){
			//var webCamPost = wCam.renderCamPost();			
			
			//$("li.sidebar-image-wrapper").after(webCamPost);
			wCam.renderCamPost();			
			//wCam.removeTakeImageButton();
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
		console.log("reset!");
	},
};

$(document).on("click", "button#btnCapture", function(){
	wCam.takeImage();
});

$(document).on("hide.bs.modal", "div.mdl-capture", function(){	
	wCam.resetWebCam();
	$(this).removeClass("mdl-capture");
});