from .models import OnboardingData, Sequence
import re

class ContactManager:
    @staticmethod
    def get_all_contacts():
        """Get all contacts from onboarding data"""
        try:
            contacts = OnboardingData.get_all()
            contact_list = []
            for contact in contacts:
                contact_list.append({
                    'id': str(contact.get('_id')),
                    'name': contact.get('full_name', ''),
                    'phone': f"{contact.get('country_code', '+91')}{contact.get('whatsapp_number', '')}",
                    'email': contact.get('business_email', ''),
                    'company': contact.get('company_name', ''),
                    'is_verified': contact.get('is_verified', False)
                })
            return contact_list
        except Exception as e:
            print(f"Error getting contacts: {e}")
            return []
    
    @staticmethod
    def add_contact(name, phone, email='', company=''):
        """Add new contact"""
        # Format phone number
        phone = re.sub(r'\D', '', phone)
        if len(phone) == 10:
            phone = f"+91{phone}"
        elif not phone.startswith('+'):
            phone = f"+{phone}"
        
        return {
            'name': name,
            'phone': phone,
            'email': email,
            'company': company
        }
    
    @staticmethod
    def get_contacts_by_industry(industry):
        """Get contacts filtered by industry"""
        contacts = ContactManager.get_all_contacts()
        return [c for c in contacts if industry in c.get('industries', [])]
    
    @staticmethod
    def get_contacts_by_objective(objective):
        """Get contacts by objective"""
        contacts = ContactManager.get_all_contacts()
        return [c for c in contacts if objective in c.get('objectives', [])]