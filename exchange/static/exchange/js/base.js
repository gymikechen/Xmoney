function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    'beforeSend': function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
        }
    }
});

//menu
function toggleMenu( id ){
    var o=document.getElementById( id );
    o.style.display=
        (o.style.display=='none') ? '' : 'none';        
}
function hideMenu( id ){
    var o=document.getElementById( id ).getElementsByTagName('ul');
    for( var i=0; i < o.length; i++)
        o[i].style.display='none';
}

function validateNumberInput(event) {
	"use strict";
	var $this = $(this),
	    min = parseFloat($this.data("jsfv-min")),
	    max = parseFloat($this.data("jsfv-max"));
	if($this.length != 1)
		throw "can only validate one $thisent";
	var val = $this.val(),
	    succ = $this.next(),
		error = !$.isNumeric(val) || val < min || val > max;

	if (succ.is(".input-group-btn")) {
		var btn = succ.children().filter('button');
		btn.prop("disabled", error);
	}

	$this.toggleClass("has-error", error && val !== "");
}

/* Multi-part modal forms */

var showFormPart = function() {
    $('.dialog-form-part').each(function() {
        $(this).removeClass('hide');
    });
};

var hideFormPart = function() {
    $('.dialog-form-part').each(function() {
        $(this).addClass('hide');
    });
};

var showConfirmPart = function() {
    $('.dialog-confirm-part').each(function() {
        $(this).removeClass('hide')
    });
};

var hideConfirmPart = function() {
    $('.dialog-confirm-part').each(function() {
        $(this).addClass('hide')
    });
};

/* Dismissable alerts */

var renderAlert = function(success, content) {
	"use strict";
	if (typeof(success) !== "boolean" || typeof(content) !== "string")
		throw "bad arguments";
	var type = success ? "success" : "danger";
    return "<div class='alert alert-"+type+" alert-dismissible' role='alert'>"
         +     "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
         +         "<span aria-hidden='true'>&times;</span>"
         +     "</button>"
         +     content
         + "</div>";
}

var showAlert = function(success, content) {
	"use strict";
	var html = renderAlert(success, content);
    $('#alert_area').prepend(html);
};

var showConfirmModal = function() {
	"use strict";
	var html = "<div class='modal-header'>"
	         +   gettext('Are you sure?')
	         + "</div>"
	         + "<div class='modal-footer'>"
	         +   "<button id='confirm-modal__no' type='button' class='btn btn-default' data-dismiss='modal'>"
	         +     gettext('No')
	         +   "</button>"
	         +   "<button id='confirm-modal__yes' type='button' class='btn btn-default' data-dismiss='modal'>"
	         +     gettext('Yes')
	         +   "</button>"
	         + "</div>";
	$('#modal-tmpl .modal-content').html(html);
	$('#modal-tmpl').modal();
}

var btnDoAjaxAction = function() {
	"use strict";
	var $this = $(this);

	if ($this.prop('disabled'))
		return;

	var label = $this.val(),
	    url = $this.data('href'),
	    noalert = Boolean($this.data('noalert')),
	    data = url.endsWith("?") ? $this.closest('form').serialize() : "";

	var doAction = function() {
		$this.addClass('disabled btn-ajax-confirmed')
		     .val(gettext("Processing..."));
		ajax({
			'url': url,
			'data': data,
			'type': 'POST',
			'context': $this
		}).done(function (response) {
			noalert || showAlert(true, "Success");
			$this.trigger("ajaxActionDone", {
				'url': url,
				'response': response
			});
		}).fail(function (e) {
			if (e.notLoggedIn) return;
			noalert || showAlert(false, "Failure");
			console.log(e);
		}).always(function (e) {
			if (!e.notLoggedIn)
				$this.removeClass('btn-ajax-confirmed');
			$this.removeClass('disabled');
			$this.val(label);
		});
	}

	if ($this.hasClass('btn-danger') && !$this.hasClass('btn-ajax-confirmed')) {
		showConfirmModal();
		$('#confirm-modal__yes').click(doAction);
	} else
		doAction();
};

var initDateTimePickers = function() {
	"use strict";
	var $dtp = $('.dtp'),
	    $single = $dtp.not('.dtp-to, .dtp-from'),
	    $linked = $dtp.not($single);

	if ($dtp.length === 0)
		return;

	$single.children('input').datetimepicker({});
	$linked.children('input').datetimepicker({useCurrent: false});

	if ($linked.length === 0)
		return;

	var $dtpTo   = $linked.filter('.dtp-to').children('input'),
	    $dtpFrom = $linked.filter('.dtp-from').children('input');

	$dtpFrom.on('dp.change', function(e) {
		$dtpTo.data("DateTimePicker").minDate(e.date);
	});
	$dtpTo.on('dp.change', function(e) {
		$dtpFrom.data("DateTimePicker").maxDate(e.date);
	});
}

$(function() {
	"use strict";
	$('.jsfv-num').each(validateNumberInput);
	$('.jsfv-num').bind("input propertychange", validateNumberInput);
	$('.btn-ajax-action').off('.btn-ajax-action')
	                     .on('click.btn-ajax-action', btnDoAjaxAction)
	                     .closest('form')
	                     .off('.btn-ajax-action')
	                     .on('submit.btn-ajax-action', function(e) {
		e.preventDefault();
		btnDoAjaxAction.apply($(this).find('.btn-ajax-action'));
	}).find('button[type=submit]').off('.btn-ajax-action');
	initDateTimePickers();
	$("#simple-menu").off('.simple-menu-toggle')
		             .on('click.simple-menu-toggle', function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});
});

function ajax(options) {
	"use strict";
	return $.ajax(options).fail(function(e) {
		if (e.responseText === '{"error": "not-logged-in"}') {
			var $ajaxBtn = $(this);
			$ajaxBtn.data('csrf', Cookies.get('csrftoken'));

			/* Show the login modal */
			$('#modal-tmpl .modal-content').load('/adminapp/login/', function(content) {
				$('#modal-tmpl').modal();
				$('#btn-login').on("ajaxActionDone", function(e, params) {
					loginHandler(params, $ajaxBtn);
					return false;
				});
			});

			e.notLoggedIn = true;
		} else e.notLoggedIn = false;
	});
}
