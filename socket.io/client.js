var init = function () {
	var socket = io.connect('http://localhost:8080');
	socket.on('news', function (data) {
		console.log(data);
		socket.emit('my other event', { my: 'data' });
	});

	function bindEvents() {
		$('input[type="button"]').click(function () {
			socket.emit('my other event', { my: $('#textToSend').val() });
		});
	}

	$(document).ready(bindEvents);

}();