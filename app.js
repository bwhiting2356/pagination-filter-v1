/********************************************************* 

    Some useful functions I pulled from stackoverflow.....

*********************************************************/

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

/********************************************************* 

    My code

*********************************************************/


$(document).ready(function() {
    // append top search bar

    var student_search = $('<div class="student-search">');
    var input = $('<input placeholder="Search for students...">');
    var button = $('<button>Search</button>');
    student_search.append(input).append(button);
    $('.page-header').append(student_search);

    // parse student list from html, reorganize with pagination

    var student_list = $('.student-item');
    var numPages;
    var currentPage;

    function paginate(list) {
        var old_list = list.slice();
        var new_list = [];
        while (old_list.length) {
            new_list.push(old_list.splice(0,10));
        }
        numPages = new_list.length;
        currentPage = 0;
        return new_list;
    }

    var paginated_students = paginate(student_list);
    var pages = $('<ul class="pages"></ul>');

    var pagination = $('<div class="pagination">').append(pages);
    $('.page').append(pagination);

    function makePageList() {
        pages.empty();

        if (numPages > 1) {
            for (var i = 0; i < numPages; i++) {
                var page_number = $('<li></li>')
                                        .append('<a></a>')
                                        .addClass('page-number')
                                        .attr('data-index', i)
                                        .text(i + 1);
                pages.append(page_number);
            }
        }

        $('.page-number').click(function() {
            var thisIndex = +$(this).attr('data-index');
            if (thisIndex !== currentPage) {
                currentPage = thisIndex;
                $(this).parent().parent().find('.page-number').removeClass('active');
                $(this).addClass('active');
                showStudents();
            } 
        });
    }
    makePageList();

    var student_ul = $('.student-list');

    function showStudents() {
        student_ul.animate({
                opacity: 0
            }, 300, function() {
                student_ul.empty();
                student_ul.append(paginated_students[currentPage]);
                if (paginated_students.length === 0) {
                    student_ul.append($('<li class="no-results">No Results Found</li>'));
                }

                student_ul.animate({
                    opacity: 1
                }, 300);
            });
    }
    showStudents();

    // wire up search box to search students and rebuild student display

    var current_search_terms;
    var new_search_terms;

    $('.student-search').find('input').keyup(function() {
        new_search_terms = $(this).val().toLowerCase().trim();

        console.log(new_search_terms);
        console.log(current_search_terms);
        console.log(new_search_terms === current_search_terms);

        if (new_search_terms !== current_search_terms) {  // don't run the function again if nothing's changed
            var filtered_students = student_list.filter(function(i) {
                var student_names = $(this).find('h3').text();
                console.log(student_names);
                if (student_names.indexOf(new_search_terms) > -1) {
                    return true;
                }
                return false;
            });
            current_search_terms = new_search_terms;
            paginated_students = paginate(filtered_students);
            currentPage = 0;
            showStudents();
            makePageList();
        }
    });
});