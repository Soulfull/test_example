'use strict';

require("../css/styles.css");

var _template = require('lodash.template');
var qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};
var qsa = function (selector, scope) {
	return (scope || document).querySelectorAll(selector);
};
var _extend = function(a, b) {
	var n;
	for (n in b) {
		if (b.hasOwnProperty(n)) {
			a[n] = b[n];
		}
	}

	return a;
};

var _pluralAge = function(age) {
	var txt;
	var count = age % 100;
	if (count >= 5 && count <= 20) {
		txt = 'лет';
	} else {
		count = count % 10;
		if (count == 1) {
			txt = 'год';
		} else if (count >= 2 && count <= 4) {
			txt = 'года';
		} else {
			txt = 'лет';
		}
	}
	return txt;
};

var PhotoCafe = function(options) {
	var self = this;

	this.options = _extend({
		usersCount: 5
	}, options);

	this.body = document.body;
	this.count = 1;
	this.template = _template(require('raw!./view/main.ejs'));
	this.init = function() {
		this.data = arguments[0];
		this.pipeData(this.data);
		this.render(this.data);
		this.initEvents();
	}

	this.getData(this.init);
}

PhotoCafe.prototype.user = {
	liked: 0,
	disliked: 0,
	skipped: 0,
	like: function() {
		this.getData(this.init);
		this.user.liked++;
		this.checkTotal();
	},
	dislike: function() {
		this.getData(this.init);
		this.user.disliked++;
		this.checkTotal();
	},
	skip: function() {
		this.getData(this.init);
		this.user.skipped++;
		this.checkTotal();
	}
}

PhotoCafe.prototype.checkTotal = function() {
	var user = this.user;
	var total = user.liked + user.disliked + user.skipped;

	if (total >= this.options.usersCount) {
		this.body.innerHTML = '<div class="cafe-results">Понравилось: ' 
		+ user.liked + '; Не понравилось: ' + user.disliked + 
		'; Пропустил: ' + user.skipped + ';</div>';
		return false;
	}
};

PhotoCafe.prototype.changeImg = function(elem) {
	var src = elem.getAttribute('href');

	this.elements.previewImg.setAttribute('src', src);
	Array.prototype.forEach.call(this.elements.thumbLink, function(link) {
		link.className = 'cafe__link';
	});
	elem.className += ' cafe__link--active';
}

PhotoCafe.prototype.initEvents = function() {
	var self = this;

	this.elements = {
		btnLike:    qs('.button--like'),
		btnDislike: qs('.button--dislike'),
		btnSkip:    qs('.button--skip'),
		thumbLink:  qsa('.cafe__link'),
		previewImg: qs('.cafe__img')
	};

	this.elements.btnLike.onclick    = this.user.like.bind(this);
	this.elements.btnDislike.onclick = this.user.dislike.bind(this);
	this.elements.btnSkip.onclick    = this.user.skip.bind(this);
	Array.prototype.forEach.call(this.elements.thumbLink, function(link) {
		link.onclick = function(e) {
			e.preventDefault();
			self.changeImg(this);
		}
	});
};

PhotoCafe.prototype.render =function(data) {
	this.body.innerHTML = this.template(data);
}

PhotoCafe.prototype.pipeData = function(data) {
	try {
		this.data = JSON.parse(data);
		this.data.ageText = _pluralAge(this.data.age);
	} catch(err) {
		throw new Error(err + "invalid json");
	}
};

PhotoCafe.prototype.getData = function(callback) {
	if (this.count > this.options.usersCount) return;
	var self = this;
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
	var xhr = new XHR();

	xhr.open('GET', 'userdata/userdata' + (this.count++) + '.json', true);

	xhr.onload = function() {
		var data = this.responseText;
		callback.call(self, data);
	}

	xhr.onerror = function() {
		throw new Error('error: ' + this.status);
	}

	xhr.send();
}

var photoCafe = new PhotoCafe();