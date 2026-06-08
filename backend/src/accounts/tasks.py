from celery import shared_task
from .sms import send_otp, cache_otp

@shared_task
def send_otp_task(phone_number, otp):
    success = send_otp(phone_number, otp)
    if success:
        cache_otp(phone_number, otp)
    return success