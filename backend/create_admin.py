from dotenv import load_dotenv
import os
from app.models import user_model, project_model, task_model
from app.models.user_model import User, UserRole
from app.db.session import SessionLocal
from app.core.security.hashing import hash_password
load_dotenv()
def create_admin():
    db = SessionLocal()
    try:
        email = os.getenv("ADMIN_EMAIL")
        password = os.getenv("ADMIN_PASSWORD")
        name = os.getenv("ADMIN_NAME", "Admin")
        if not email or not password:
            print(" ADMIN_EMAIL or ADMIN_PASSWORD not set in .env")
            return
        existing_admin = db.query(User).filter(User.email == email).first()
        if existing_admin:
            existing_admin.password_hash = hash_password(password)
            existing_admin.role = UserRole.ADMIN
            existing_admin.name = name
            db.commit()
            print("Admin updated (password + role synced with .env)")
        else:
            admin = User(
                name=name,
                email=email,
                password_hash=hash_password(password),
                role=UserRole.ADMIN
            )
            db.add(admin)
            db.commit()
            print("Admin created successfully")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()
if __name__ == "__main__":
    create_admin()