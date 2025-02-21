import os
import smtplib
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SECRET_KEY = os.getenv("SECRET_KEY")
VERIFICATION_SECRET_KEY = os.getenv("VERIFICATION_SECRET_KEY")
ALGORITHM = "HS256"
VERIFICATION_TOKEN_EXPIRE_MINUTES = 60
ACCESS_TOKEN_EXPIRE_MINUTES = 60 
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "token_type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_verification_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=VERIFICATION_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, VERIFICATION_SECRET_KEY, algorithm=ALGORITHM)


def send_verification_email(to_email: str, verification_link: str):
    """
    Sends a verification email to the specified address containing the verification link.
    """

    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    from_email = smtp_username
    subject = "Verify Your Email Address"
    
    text_content = f"""\
        Hi,

        Thank you for registering. Please verify your email address by clicking on the link below:
        {verification_link}

        If you did not register, please ignore this email.
        """
    html_content = f"""\
        <html>
        <body>
            <p>Hi,</p>
            <p>Thank you for registering. Please verify your email address by clicking on the link below:</p>
            <p><a href="{verification_link}">Verify Email</a></p>
            <p>If you did not register, please ignore this email.</p>
        </body>
        </html>
        """
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email

    part1 = MIMEText(text_content, "plain")
    part2 = MIMEText(html_content, "html")
    message.attach(part1)
    message.attach(part2)

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        print(f"Connected to SMTP server {smtp_server}")
        server.starttls() 
        server.login(smtp_username, smtp_password)
        print(f"Logged in as {smtp_username}")
        print(f"Server {server}")
        server.sendmail(from_email, to_email, message.as_string())
        server.quit()
        print(f"Verification email sent to {to_email}")
    except Exception as e:
        print(f"Error sending email to {to_email}: {e}")
