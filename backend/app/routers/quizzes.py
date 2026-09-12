from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models import Quiz, QuizAttempt, QuizQuestion
from app.schemas.quiz import (
    QuizAttemptResponse,
    QuizDetailResponse,
    QuizHistoryResponse,
    QuizResponse,
    QuizSubmission,
)

router = APIRouter(
    prefix="/api/quizzes",
    tags=["Quizzes"],
)


@router.get("", response_model=list[QuizResponse])
def get_quizzes(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    quizzes = db.scalars(
        select(Quiz).order_by(Quiz.id)
    ).all()

    return quizzes

@router.get("/history", response_model=list[QuizHistoryResponse])
def get_quiz_history(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    attempts = db.scalars(
        select(QuizAttempt)
        .where(QuizAttempt.user_id == user_id)
        .order_by(QuizAttempt.completed_at.desc())
    ).all()

    history = []

    for attempt in attempts:
        quiz = db.scalar(
            select(Quiz).where(Quiz.id == attempt.quiz_id)
        )

        if not quiz:
            continue

        percentage = (
            round((attempt.score / attempt.total_points) * 100)
            if attempt.total_points > 0
            else 0
        )

        history.append(
            {
                "id": attempt.id,
                "quiz_id": attempt.quiz_id,
                "quiz_title": quiz.title,
                "score": attempt.score,
                "total_points": attempt.total_points,
                "percentage": percentage,
                "completed_at": attempt.completed_at,
            }
        )

    return history
@router.get("/{quiz_id}", response_model=QuizDetailResponse)
def get_quiz(
    quiz_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    quiz = db.scalar(
        select(Quiz).where(Quiz.id == quiz_id)
    )

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )

    questions = db.scalars(
        select(QuizQuestion)
        .where(QuizQuestion.quiz_id == quiz_id)
        .order_by(QuizQuestion.id)
    ).all()

    return {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "disaster_type": quiz.disaster_type,
        "questions": questions,
    }


@router.post(
    "/{quiz_id}/submit",
    response_model=QuizAttemptResponse,
    status_code=status.HTTP_201_CREATED,
)
@router.post(
    "/{quiz_id}/submit",
    response_model=QuizAttemptResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_quiz(
    quiz_id: int,
    data: QuizSubmission,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    quiz = db.scalar(select(Quiz).where(Quiz.id == quiz_id))

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )

    questions = db.scalars(
        select(QuizQuestion)
        .where(QuizQuestion.quiz_id == quiz_id)
        .order_by(QuizQuestion.id)
    ).all()

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This quiz has no questions",
        )

    score = 0
    total_points = 0
    results = []

    for question in questions:
        total_points += question.points

        selected_option = data.answers.get(question.id)

        if selected_option:
            selected_option = selected_option.upper()

        correct_option = question.correct_option.upper()

        is_correct = selected_option == correct_option

        points_earned = question.points if is_correct else 0

        if is_correct:
            score += question.points

        results.append(
            {
                "question_id": question.id,
                "selected_option": selected_option,
                "correct_option": correct_option,
                "explanation": question.explanation,
                "is_correct": is_correct,
                "points_earned": points_earned,
                "points": question.points,
            }
        )

    attempt = QuizAttempt(
        user_id=user_id,
        quiz_id=quiz_id,
        score=score,
        total_points=total_points,
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {
        "id": attempt.id,
        "quiz_id": attempt.quiz_id,
        "score": attempt.score,
        "total_points": attempt.total_points,
        "results": results,
    }
    quiz = db.scalar(
        select(Quiz).where(Quiz.id == quiz_id)
    )

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )

    questions = db.scalars(
        select(QuizQuestion)
        .where(QuizQuestion.quiz_id == quiz_id)
    ).all()

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This quiz has no questions",
        )

    score = 0
    total_points = 0

    for question in questions:
        total_points += question.points

        selected_option = data.answers.get(question.id)

        if selected_option:
            selected_option = selected_option.upper()

        if selected_option == question.correct_option.upper():
            score += question.points

    attempt = QuizAttempt(
        user_id=user_id,
        quiz_id=quiz_id,
        score=score,
        total_points=total_points,
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return attempt

