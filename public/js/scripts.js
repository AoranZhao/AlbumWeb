$(document).ready(function() {
	$('#post-comment').hide();
	$('#btn-comment').on('click', function(event) {
		event.preventDefault();
		if($('#post-comment').is(':hidden')) {
			$('#post-comment').show();
		} else {
			$('#post-comment').hide();
		}	
	});

	$('#btn-like').on('click', function(event) {
		event.preventDefault();

		var imgId = $(this).data('id');
		$.post('/images/' + imgId + '/like').done(function(data) {
			$('.likes-count').text(data.likes);
		})
	})

	$('#btn-delete').on('click', function(event) {
		event.preventDefault();
		var $this = $(this);

		var remove = confirm('Are you sure you want to delete this image?');
		if (remove) {
			var imgId = $(this).data('id');
			$.ajax({
				url: '/images/' + imgId,
				type: 'DELETE'
			}).done(function(result) {
				if (result) {
					$this.removeClass('btn-danger').addClass('btn-success');
					$this.find('i').removeClass('fa fa-times').addClass('fa fa-check');
					$this.append('<span> Deleted!</span>');
					$this.prop('disabled', true);
					$('#btn-like').prop('disabled', true);
				}
			})
		}
	})
})