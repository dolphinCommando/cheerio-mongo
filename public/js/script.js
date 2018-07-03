$(document).ready(function() {

  $('.notes').click(function(event) {
    event.preventDefault();
    var articleId = $(this).attr('data-id');
    $('#modalNotes').attr('data-articleId', articleId);
    getNotes(articleId);
  });

  $('#compose').click(function(event) {
    event.preventDefault();
    var articleId = $('#modalNotes').attr('data-articleId');
    var noteId = $('#modalCompose').attr('data-noteid');
    var role = $('#modalCompose').attr('data-role');
    var comment = {
      title: $('#commentTitle').val().trim(),
      body: $('#commentBody').val().trim()
    };
    postOrUpdate(articleId, noteId, role, comment, function(data) {
      console.log(data);
      getNotes(articleId);
    })
    
  });

  $('body').on('click', '.commentEdit', function(event) {
    event.preventDefault();
    var commentParent = $(this).parent();
    console.log(commentParent);
    $('#commentTitle').val(commentParent.children('h6').text());
    $('#commentBody').val(commentParent.children('p').text());
    $('#modalCompose').attr('data-role', 'put');
    $('#modalCompose').attr('data-noteid', commentParent.attr('data-id'));
  });

  $('body').on('click', '.commentDelete', function(event) {
    event.preventDefault();
    var commentParent = $(this).parent();
    var noteId = commentParent.attr('data-id');
    var articleId = $('#modalNotes').attr('data-articleId');
    $.ajax({
      method: "DELETE",
      url: `/notes/${articleId}/${noteId}`
    }, function(data) {
      console.log('Note deleted');
      getNotes(articleId);
    });
  });

  function getNotes(articleId) {
    $('.modalComments').empty();
    $.post(`/notes`, {id: articleId}, function(data) {
      console.log(data);
      data.forEach(function(item) {
        $('.modalComments').prepend(`
        <div data-id="${item._id}">
        <h6>${item.title}</h6>
        <p>${item.body}</p>
        <button class="btn btn-warning commentEdit">Edit</button>
        <button class="btn btn-danger commentDelete">Delete</button>
        </div>
        `);
      });
    });
    $('#commentTitle').val('');
    $('#commentBody').val('');
    $('#modalCompose').attr('data-role', 'post');
    $('#modalCompose').attr('data-noteid', '');
    $('#modalNotes').modal({show: true});
  };

  function postOrUpdate(articleId, noteId, role, comment, callback) {
    if (role === 'post') {
      $.post(`/notes/${articleId}`, comment, function(data) {
        callback(data);
      });
    }
    else if (role === 'put') {
      $.ajax({
        method: "PUT",
        url: `/notes/${articleId}/${noteId}`, 
        data: comment
      }, function(data) {
        callback(data);
      });
    }
    else {
      console.log('Error in #modalCompose data-role');
    }
  }

});