from datetime import datetime
from pydantic import BaseModel, Field

class QuizQuestionResponse(BaseModel):
    id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    points: int

    model_config = {"from_attributes": True}


class QuizResponse(BaseModel):
    id: int
    title: str
    description: str
    disaster_type: str

    model_config = {"from_attributes": True}


class QuizDetailResponse(QuizResponse):
    questions: list[QuizQuestionResponse]


class QuizSubmission(BaseModel):
    answers: dict[int, str] = Field(
        description="Question ID mapped to selected option: A, B, C or D"
    )


class QuizQuestionResult(BaseModel):
    question_id: int
    selected_option: str | None
    correct_option: str
    explanation: str
    is_correct: bool
    points_earned: int
    points: int


class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    score: int
    total_points: int
    results: list[QuizQuestionResult]

class QuizHistoryResponse(BaseModel):
    id: int
    quiz_id: int
    quiz_title: str
    score: int
    total_points: int
    percentage: int
    completed_at: datetime