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

        # -------------------------
        # All-hazards decision practice
        # -------------------------
        all_hazards = Quiz(
            title="Emergency Decision Practice",
            description="Short real-world scenarios that build calm, safe choices across disasters.",
            disaster_type="All hazards",
        )

        all_hazards.questions = [
            QuizQuestion(
                question="An official alert and a viral social-media post give different evacuation instructions. What should you do first?",
                option_a="Follow the post because it was shared first",
                option_b="Check the official alert source or local authority channel",
                option_c="Wait until friends agree on an answer",
                option_d="Share both messages widely",
                correct_option="B",
                explanation="Official authorities can confirm the affected area, timing, and instructions. Do not amplify unverified information during an emergency.",
                points=10,
            ),
            QuizQuestion(
                question="Your family cannot reach each other by phone after an emergency. What plan should already be in place?",
                option_a="A meeting place and an out-of-area contact",
                option_b="A promise to keep calling repeatedly",
                option_c="A social-media group only",
                option_d="No plan is needed if everyone knows the area",
                correct_option="A",
                explanation="A known meeting point and a trusted contact reduce confusion when networks are overloaded or local travel is disrupted.",
                points=10,
            ),
            QuizQuestion(
                question="Which action best preserves mobile networks during a widespread emergency?",
                option_a="Make long calls to update every contact",
                option_b="Repeatedly refresh social media",
                option_c="Send a short text message when possible",
                option_d="Stream live video from the affected area",
                correct_option="C",
                explanation="Short messages use less network capacity and are more likely to get through when voice networks are congested.",
                points=10,
            ),
            QuizQuestion(
                question="You are told to evacuate. Which item should be prioritised if time is limited?",
                option_a="Large furniture",
                option_b="Emergency medicines, identification and water",
                option_c="Decorative valuables only",
                option_d="Heavy appliances",
                correct_option="B",
                explanation="Prioritise life-safety essentials and documents you cannot easily replace; leave early rather than packing extensively.",
                points=10,
            ),
            QuizQuestion(
                question="What is the safest way to use an alert app during a crisis?",
                option_a="Treat every weather estimate as an evacuation order",
                option_b="Use it to find verified notices, then follow local official instructions",
                option_c="Assume no alert means every hazard is impossible",
                option_d="Ignore authorities once the app is open",
                correct_option="B",
                explanation="Apps help organise information, but emergency decisions should follow verified local authorities and changing on-the-ground conditions.",
                points=10,
            ),
        ]

        db.add_all([flood, earthquake, cyclone, all_hazards])
        db.commit()

        # The result screen should teach, not merely mark answers right or wrong.
        from update_quiz_explanations import update_explanations
        update_explanations()

        print("Successfully added 4 quizzes with 20 questions.")

    except Exception as error:
        db.rollback()
        print(f"Error while seeding quizzes: {error}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_quizzes()
