from flask import Blueprint, jsonify, request
from app.models import db, Comment, User
from flask_login import current_user, login_required
from ..forms import CommentForm

comments = Blueprint('comments', __name__)

#get all comments from a specific expense
@comments.route('/<int:id>/allcomments')
@login_required
def allCommentForExpense(id):

    '''get all comments from selected expense AND add user info'''
    comments = Comment.query.filter(Comment.expense_id == id).all()
    print(f'all the comments for the specific expense {comments}')
    # for comment in comments:
    #     comment.user = comment.user

    print(f'AFTER ADDIND comments looks like {comments}')
    commentDict = [comment.to_dict() for comment in comments]
    print(f'all the comments for the specific expense-- {commentDict}')

    return commentDict


#get all comments
@comments.route('/allcomments')
@login_required
def allComment():
    '''get all comments'''
    allcomments = Comment.query.all()
    print(f'this is all comments {allcomments}')
    allcommentsDict = [comment.to_dict() for comment in allcomments]
    return allcommentsDict


#create a comment
@comments.route('/<int:id>', methods=['POST'])
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
        return new_comment.to_dict()
    return form.errors



#delete a comment
@comments.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteComment(id):
    deletedcomment = Comment.query.get(id)

    if deletedcomment is not None:
        deletedcommentDict = deletedcomment.to_dict()
        db.session.delete(deletedcomment)
        db.session.commit()
        return deletedcommentDict
    return "The comment does not exisit"


#update a comment- comment
@comments.route('/<int:id>', methods=['PUT'])
@login_required
def updateComment(id):
    form = CommentForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']
    updatedcomment = Comment.query.get(id)
    if updatedcomment is not None:
        if form.validate_on_submit():
            updatedcomment.comment = form.data['comment']
            db.session.commit()
            updatedcommentDict =  updatedcomment.to_dict()
            return updatedcommentDict
    return "The comment does not exisit"
