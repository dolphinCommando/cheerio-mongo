$(document).ready(function() {

  $('.notes').click(function(event) {
    event.preventDefault();
    $('.modalComments').empty();
    var articleId = $(this).attr('data-id');
    $('#modalNotes').attr('data-articleId', articleId);
    getNotes(articleId);
  });

  $('#compose').click(function(event) {
    event.preventDefault();
    var id = $('#modalNotes').attr('data-articleId');
    $('#modalNotes').modal({show: false});
    $.post('/notes/submit', {
      comment: {
        title: $('#commentTitle').val().trim(),
        body: $('#commentBody').val().trim()
      },
      id: id
    }, function(data) {
      console.log(data);
      $('#commentTitle').val('');
      $('#commentBody').val('');
      console.log('data id ' + id)
      getNotes(id);

    });
  });

  function getNotes(articleId) {
    $.post(`/notes`, {id: articleId}, function(data) {
      console.log(data);
      data.forEach(function(item) {
        $('.modalComments').prepend(`
        <div>
        <h6>${item.title}</h6>
        <p>${item.body}</p>
        <button class="btn btn-warning commentEdit">Edit</button>
        <button class="btn btn-danger commentDelete">Delete</button>
        </div>
        `);
      });
    });
    $('#modalNotes').modal({show: true});
  }

});