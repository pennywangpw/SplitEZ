from flask import Blueprint, jsonify, request
from app.models import db, Comment, User
from flask_login import current_user, login_required
from ..forms import CommentForm

comments = Blueprint('comments', __name__)



#get all comments
@comments.route('/<int:id>/allcomments')
@login_required
def allCommentForExpense(id):
    print(f'passed in id {id}')

    # '''get all comments from selected expense'''
    # comments = Comment.query.filter(Comment.expense_id == id)
    # print(f'all the comments for the specific expense {comments}')
    # commentDict = [comment.to_dict() for comment in comments]
    # print(f'all the comments for the specific expense-- {commentDict}')

    '''get all comments from selected expense with users detail'''
    allcomments = Comment.query.all()
    print(f'====all comments {allcomments}')
    allcommentsDict = [all.to_dict() for all in allcomments]

    '''add user detail attribute'''
    for comment in allcommentsDict:
        userinfo = User.query.get(comment['user_id'] == current_user.id)
        if userinfo != None:
            comment['user'] = userinfo.to_dict()

    '''filter comments by expense_id'''
    comments = [comment for comment in allcommentsDict if comment['expense_id'] == id]

    print(f'all the comments for the specific expense {comments}')

    return comments



#create a comment
@comments.route('/<int:id>/allcomments', methods=['POST'])
@login_required
def createComment(id):
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_comment = Comment(
            comment = form.data['comment'],
            user_id = current_user.id,
            expense_id = id
        )
        db.session.add(new_comment)
        db.session.commit()
        print(f'this is create new_comment {new_comment}')
        return new_comment.to_dict()
    return "Bad Data"
