# accounts/sms.py
import random
import logging
from datetime import timedelta
from django.core.cache import cache
from django.conf import settings
from sms_ir import SmsIr

logger = logging.getLogger(__name__)


_sms_client = None

def get_sms_client():
    """Create or return the SMS.ir client singleton."""
    global _sms_client
    if _sms_client is None:
        api_key = getattr(settings, "SMS_IR_API_KEY", None)
        line_number = getattr(settings, "SMS_IR_LINE_NUMBER", None)
        if not api_key:
            raise ValueError("SMS_IR_API_KEY is not set in settings")
        _sms_client = SmsIr(api_key, line_number)
    return _sms_client


def generate_otp():
    """Generate a random numeric OTP with configured length."""
    length = getattr(settings, "SMS_VERIFICATION_CODE_LENGTH", 6)
    range_start = 10 ** (length - 1)
    range_end = (10 ** length) - 1
    return str(random.randint(range_start, range_end))


def _format_expiry_text():
    """Return a human-readable Persian expiry text."""
    expiry_seconds = getattr(settings, "SMS_VERIFICATION_CODE_EXPIRY", 300)
    minutes = expiry_seconds // 60
    if minutes <= 0:
        return "چند لحظه"
    return f"{minutes} دقیقه"


def send_otp(phone_number: str, otp: str) -> bool:
    """
    Send OTP via SMS.ir using the send_verify_code method.
    Returns True if sent successfully (or mocked in dev mode), False otherwise.
    """
    if getattr(settings, "SMS_DEBUG", True):
        logger.info(f"[DEV MODE] OTP for {phone_number}: {otp}")
        print(f"[DEV MODE] OTP for {phone_number}: {otp}")
        return True

    # Production: use the official library
    try:
        client = get_sms_client()
        template_id = getattr(settings, "SMS_IR_TEMPLATE_ID", None)
        if not template_id:
            logger.error("SMS_IR_TEMPLATE_ID is not set in settings")
            return False

        
        parameters = [
            {"name": "CODE", "value": otp},
            {"name": "EXPIREDATE", "value": _format_expiry_text()}
        ]

        
        result = client.send_verify_code(phone_number, template_id, parameters)

        
        if hasattr(result, 'status_code') and result.status_code == 200:
            logger.info(f"OTP sent successfully to {phone_number}")
            return True
        elif hasattr(result, 'status') and result.status == 1:
            logger.info(f"OTP sent successfully to {phone_number}")
            return True
        else:
            logger.error(f"SMS.ir library error: {result}")
            return False

    except Exception as e:
        logger.exception(f"Failed to send OTP via smsir-python: {e}")
        return False


def cache_otp(phone_number: str, otp: str) -> None:
    """Cache the OTP with expiry defined in settings."""
    timeout = getattr(settings, "SMS_VERIFICATION_CODE_EXPIRY", 600)
    cache_key = f"otp:{phone_number}"
    cache.set(cache_key, otp, timeout)


def verify_otp(phone_number: str, otp: str) -> bool:
    """Verify OTP from cache and delete it on success."""
    cache_key = f"otp:{phone_number}"
    stored = cache.get(cache_key)
    if stored and stored == otp:
        cache.delete(cache_key)
        return True
    return False