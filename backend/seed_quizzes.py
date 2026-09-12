from app.core.database import SessionLocal
from app.models import Quiz, QuizQuestion


def seed_quizzes():
    db = SessionLocal()

    try:
        # Prevent duplicate quiz data
        existing_quizzes = db.query(Quiz).count()

        if existing_quizzes > 0:
            print("Quizzes already exist. Nothing to add.")
            return

        # -------------------------
        # Flood Safety Quiz
        # -------------------------
        flood = Quiz(
            title="Flood Safety Quiz",
            description="Test your knowledge about staying safe during floods.",
            disaster_type="Flood",
        )

        flood.questions = [
            QuizQuestion(
                question="What should you do when a flood warning is issued?",
                option_a="Move to a safer or higher location",
                option_b="Go near the river",
                option_c="Stay in the basement",
                option_d="Drive through floodwater",
                correct_option="A",
                points=10,
            ),
            QuizQuestion(
                question="What should you avoid during a flood?",
                option_a="Listening to official alerts",
                option_b="Moving to higher ground",
                option_c="Walking or driving through floodwater",
                option_d="Keeping an emergency kit ready",
                correct_option="C",
                points=10,
            ),
            QuizQuestion(
                question="Which item is useful during a flood emergency?",
                option_a="Emergency flashlight",
                option_b="Glass decoration",
                option_c="Heavy furniture",
                option_d="Unused electronic device",
                correct_option="A",
                points=10,
            ),
            QuizQuestion(
                question="Where should you go during severe flooding?",
                option_a="Low-lying area",
                option_b="Higher ground",
                option_c="River bank",
                option_d="Underground parking",
                correct_option="B",
                points=10,
            ),
            QuizQuestion(
                question="Which source should you follow for official emergency information?",
                option_a="Random social media posts",
                option_b="Unverified messages",
                option_c="Official authorities and emergency alerts",
                option_d="Rumors",
                correct_option="C",
                points=10,
            ),
        ]

        # -------------------------
        # Earthquake Safety Quiz
        # -------------------------
        earthquake = Quiz(
            title="Earthquake Safety Quiz",
            description="Test your knowledge about earthquake preparedness and safety.",
            disaster_type="Earthquake",
        )

        earthquake.questions = [
            QuizQuestion(
                question="What is the recommended action during an earthquake indoors?",
                option_a="Run outside immediately",
                option_b="Drop, Cover and Hold On",
                option_c="Stand near a window",
                option_d="Use an elevator",
                correct_option="B",
                points=10,
            ),
            QuizQuestion(
                question="Which place should you avoid during an earthquake?",
                option_a="Under a sturdy table",
                option_b="Near windows or glass",
                option_c="Protected interior area",
                option_d="Under sturdy furniture",
                correct_option="B",
                points=10,
            ),
            QuizQuestion(
                question="What should you avoid using after an earthquake if there may be damage?",
                option_a="Emergency flashlight",
                option_b="Emergency radio",
                option_c="Damaged electrical equipment",
                option_d="Emergency supplies",
                correct_option="C",
                points=10,
            ),
            QuizQuestion(
                question="What should you do after the shaking stops?",
                option_a="Check for injuries and hazards",
                option_b="Immediately use an elevator",
                option_c="Return to damaged buildings",
                option_d="Ignore official instructions",
                correct_option="A",
                points=10,
            ),
            QuizQuestion(
                question="Why should heavy objects be secured before an earthquake?",
                option_a="To make rooms look better",
                option_b="To prevent them from falling and causing injury",
                option_c="To increase electricity",
                option_d="To reduce noise",
                correct_option="B",
                points=10,
            ),
        ]

        # -------------------------
        # Cyclone Safety Quiz
        # -------------------------
        cyclone = Quiz(
            title="Cyclone Safety Quiz",
            description="Test your knowledge about preparing for and staying safe during cyclones.",
            disaster_type="Cyclone",
        )

        cyclone.questions = [
            QuizQuestion(
                question="What should you do when a cyclone warning is issued?",
                option_a="Ignore the warning",
                option_b="Prepare emergency supplies and follow official instructions",
                option_c="Go to the beach",
                option_d="Stay outdoors",
                correct_option="B",
                points=10,
            ),
            QuizQuestion(
                question="Which item should be included in an emergency kit?",
                option_a="Flashlight",
                option_b="Glass decoration",
                option_c="Large furniture",
                option_d="Unnecessary electronic items",
                correct_option="A",
                points=10,
            ),
            QuizQuestion(
                question="During a cyclone, where is generally safer?",
                option_a="Near windows",
                option_b="Outside",
                option_c="Inside a secure building away from windows",
                option_d="On the roof",
                correct_option="C",
                points=10,
            ),
            QuizQuestion(
                question="What should you do with outdoor objects before a cyclone?",
                option_a="Leave them loose",
                option_b="Secure or move them indoors when safe",
                option_c="Put them near windows",
                option_d="Throw them into the street",
                correct_option="B",
                points=10,
            ),
            QuizQuestion(
                question="What should you follow during a cyclone emergency?",
                option_a="Rumors",
                option_b="Unverified social media posts",
                option_c="Official emergency instructions",
                option_d="Random messages",
                correct_option="C",
                points=10,
            ),
        ]

        db.add_all([flood, earthquake, cyclone])
        db.commit()

        print("Successfully added 3 quizzes with 15 questions.")

    except Exception as error:
        db.rollback()
        print(f"Error while seeding quizzes: {error}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_quizzes()