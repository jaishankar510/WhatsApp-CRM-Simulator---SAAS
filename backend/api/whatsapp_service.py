from twilio.rest import Client
from django.conf import settings
import random

class WhatsAppService:
    def __init__(self):
        # Twilio credentials (get from https://www.twilio.com/console)
        self.account_sid = "YOUR_TWILIO_ACCOUNT_SID"
        self.auth_token = "YOUR_TWILIO_AUTH_TOKEN"
        self.whatsapp_number = "whatsapp:+14155238886"  # Twilio sandbox number
        
        # For demo mode
        self.demo_mode = True  # Set to False when you have Twilio credentials
        
    def send_message(self, to_number, message, template_name=None, template_data=None):
        """
        Send WhatsApp message
        """
        # Format phone number (remove + if present, add whatsapp: prefix)
        if not to_number.startswith('whatsapp:'):
            formatted_number = f"whatsapp:{to_number}"
        else:
            formatted_number = to_number
        
        if self.demo_mode or not self.account_sid:
            # Demo mode - simulate sending
            print(f"📱 [DEMO] Sending to {formatted_number}: {message}")
            return {
                'success': True,
                'message': f'Demo: Message sent to {to_number}',
                'demo': True,
                'content': message
            }
        else:
            try:
                client = Client(self.account_sid, self.auth_token)
                message_obj = client.messages.create(
                    body=message,
                    from_=self.whatsapp_number,
                    to=formatted_number
                )
                return {
                    'success': True,
                    'sid': message_obj.sid,
                    'status': message_obj.status
                }
            except Exception as e:
                return {
                    'success': False,
                    'error': str(e)
                }
    
    def send_template_message(self, to_number, template_name, template_data):
        """
        Send templated WhatsApp message
        """
        # Render template with data
        from .models import MessageTemplate
        try:
            template = MessageTemplate.objects.get(name=template_name)
            message = template.body
            for key, value in template_data.items():
                message = message.replace(f'{{{{{key}}}}}', value)
            return self.send_message(to_number, message)
        except Exception as e:
            return {'success': False, 'error': str(e)}

# Create singleton instance
whatsapp_service = WhatsAppService()