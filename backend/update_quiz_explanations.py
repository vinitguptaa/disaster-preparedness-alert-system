from app.core.database import SessionLocal
from app.models import QuizQuestion


EXPLANATIONS = {
    1: "Moving to higher or safer ground reduces the risk of being trapped by rising floodwater.",
    2: "Floodwater can hide dangerous debris, open drains, electrical hazards, and strong currents, so walking or driving through it should be avoided.",
    3: "A flashlight helps you see safely when electricity is unavailable during an emergency.",
    4: "Higher ground is generally safer during flooding because floodwater collects in low-lying areas.",
    5: "Official authorities and emergency alert systems provide verified information and instructions during disasters.",

    6: "Drop, Cover and Hold On helps protect you from falling objects and debris during earthquake shaking.",
    7: "Windows and glass can break during an earthquake and cause serious injuries.",
    8: "Damaged electrical equipment can cause electric shock or fire, so it should be avoided.",
    9: "After shaking stops, checking for injuries and hazards helps you respond safely to the situation.",
    10: "Securing heavy objects helps prevent them from falling and injuring people during earthquake shaking.",

    11: "When a cyclone warning is issued, preparing supplies and following official instructions helps reduce risk.",
    12: "A flashlight is useful when power outages occur during a cyclone or other emergency.",
    13: "A secure indoor location away from windows provides better protection from strong winds and flying debris.",
    14: "Securing outdoor objects prevents them from becoming dangerous projectiles during strong winds.",
    15: "Official emergency instructions are the most reliable source for actions to take during a cyclone.",
}


def update_explanations():
    db = SessionLocal()

    try:
        questions = db.query(QuizQuestion).all()

        updated = 0

        for question in questions:
            if question.id in EXPLANATIONS:
                question.explanation = EXPLANATIONS[question.id]
                updated += 1

        db.commit()

        print(f"Successfully added explanations to {updated} questions.")

    except Exception as error:
        db.rollback()
        print(f"Error updating explanations: {error}")

    finally:
        db.close()


if __name__ == "__main__":
    update_explanations()
    