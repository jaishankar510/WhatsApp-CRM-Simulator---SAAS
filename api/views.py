





from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import uuid
import random
from datetime import datetime
from .models import User, OnboardingData, MessageTemplate, Sequence, Contact, IntegrationStatus

def get_current_user(request):
    user_id = request.session.get('user_id')
    if user_id:
        return User.get_by_user_id(user_id)
    return None

# ========== AUTH ==========

@api_view(['POST'])
def signup(request):
    try:
        email = request.data.get('email')
        name = request.data.get('name')
        
        existing = User.get_by_email(email)
        if existing:
            return Response({'success': False, 'error': 'Email already registered'}, status=400)
        
        user_id = User.create(email, name)
        request.session['user_id'] = user_id
        
        return Response({'success': True, 'user_id': user_id, 'message': 'Signup successful! Please complete onboarding.'})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=400)

@api_view(['POST'])
def send_login_otp(request):
    try:
        email = request.data.get('email')
        user = User.get_by_email(email)
        
        if not user:
            return Response({'success': False, 'error': 'User not found. Please sign up first.'}, status=404)
        
        if user.get('status') != 'completed':
            return Response({'success': False, 'error': 'Please complete onboarding first.'}, status=400)
        
        # Get user's WhatsApp number from onboarding
        onboarding = OnboardingData.get(user['user_id'])
        if not onboarding:
            return Response({'success': False, 'error': 'No onboarding data found'}, status=404)
        
        whatsapp_number = onboarding.get('whatsapp_number')
        otp = str(random.randint(100000, 999999))
        
        request.session['login_otp'] = otp
        request.session['login_email'] = email
        request.session['otp_expiry'] = datetime.now().timestamp() + 300
        
        return Response({
            'success': True, 
            'message': f'OTP sent to {whatsapp_number}', 
            'otp': otp,  # For demo
            'whatsapp_number': whatsapp_number,
            'mode': 'demo'
        })
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=400)

@api_view(['POST'])
def verify_login_otp(request):
    try:
        entered_otp = request.data.get('otp')
        session_otp = request.session.get('login_otp')
        
        if not session_otp:
            return Response({'success': False, 'error': 'No OTP found. Please request new OTP.'}, status=400)
        
        if entered_otp == session_otp:
            email = request.session.get('login_email')
            user = User.get_by_email(email)
            if user:
                request.session['user_id'] = user['user_id']
                return Response({'success': True, 'message': 'Login successful!', 'user': {'name': user['name'], 'email': user['email']}})
        
        return Response({'success': False, 'error': 'Invalid OTP'}, status=400)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=400)

@api_view(['POST'])
def logout(request):
    request.session.flush()
    return Response({'success': True, 'message': 'Logged out'})

# ========== ONBOARDING OTP (During onboarding) ==========

@api_view(['POST'])
def send_otp(request):
    otp = str(random.randint(100000, 999999))
    request.session['onboarding_otp'] = otp
    request.session['otp_expiry'] = datetime.now().timestamp() + 300
    return Response({'success': True, 'message': 'OTP sent!', 'otp': otp, 'mode': 'demo'})

@api_view(['POST'])
def verify_otp(request):
    entered_otp = request.data.get('otp')
    session_otp = request.session.get('onboarding_otp')
    if not session_otp:
        return Response({'verified': False, 'error': 'No OTP found'}, status=400)
    if entered_otp == session_otp:
        request.session['otp_verified'] = True
        del request.session['onboarding_otp']
        return Response({'verified': True, 'message': 'OTP verified!'})
    return Response({'verified': False, 'error': 'Invalid OTP'}, status=400)

@api_view(['POST'])
def complete_onboarding(request):
    user = get_current_user(request)
    if not user:
        return Response({'success': False, 'error': 'User not found'}, status=401)
    
    try:
        data = request.data
        OnboardingData.create(user['user_id'], {
            'full_name': data.get('full_name', ''),
            'business_email': data.get('business_email', ''),
            'whatsapp_number': data.get('whatsapp_number', ''),
            'country_code': data.get('country_code', '+91'),
            'company_name': data.get('company_name', ''),
            'employee_count': data.get('employee_count', ''),
            'annual_revenue': data.get('annual_revenue', ''),
            'industries': data.get('industries', []),
            'sub_category': data.get('sub_category', ''),
            'objectives': data.get('objectives', []),
            'is_verified': True
        })
        
        # Update user status to completed
        User.update_status(user['user_id'], 'completed')
        
        return Response({'success': True, 'message': 'Onboarding completed!'}, status=201)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=400)

@api_view(['GET'])
def get_onboarding_status(request):
    user = get_current_user(request)
    if not user:
        return Response({'onboarded': False}, status=200)
    
    onboarding = OnboardingData.get(user['user_id'])
    return Response({'onboarded': onboarding is not None, 'user': {'name': user['name'], 'email': user['email']}})

# ========== TEMPLATES, SEQUENCES, CONTACTS (Same as before with user isolation) ==========

@api_view(['GET'])
def get_templates(request):
    user = get_current_user(request)
    if not user:
        return Response([], status=200)
    templates = MessageTemplate.get_all(user['user_id'])
    result = [{'template_id': str(t.get('_id')), 'name': t.get('name', ''), 'body': t.get('body', ''), 'status': t.get('status', 'draft'), 'created_by': t.get('created_by', 'Admin')} for t in templates]
    return Response(result)

@api_view(['POST'])
def create_template(request):
    user = get_current_user(request)
    if not user:
        return Response({'error': 'Not authenticated'}, status=401)
    try:
        result = MessageTemplate.create(user['user_id'], request.data)
        return Response({'success': True, 'template_id': str(result.inserted_id)}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
def delete_template(request, template_id):
    user = get_current_user(request)
    if not user:
        return Response({'error': 'Not authenticated'}, status=401)
    result = MessageTemplate.delete(user['user_id'], template_id)
    return Response({'success': result.deleted_count > 0})

@api_view(['GET'])
def get_sequences(request):
    user = get_current_user(request)
    if not user:
        return Response([], status=200)
    sequences = Sequence.get_all(user['user_id'])
    result = [{'sequence_id': str(s.get('_id')), 'name': s.get('name', ''), 'type': s.get('sequence_type', 'one-time'), 'status': s.get('status', 'draft'), 'active': s.get('active', False)} for s in sequences]
    return Response(result)

@api_view(['POST'])
def create_sequence(request):
    user = get_current_user(request)
    if not user:
        return Response({'error': 'Not authenticated'}, status=401)
    try:
        result = Sequence.create(user['user_id'], request.data)
        return Response({'success': True, 'sequence_id': str(result.inserted_id)}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
def delete_sequence(request, sequence_id):
    user = get_current_user(request)
    if not user:
        return Response({'error': 'Not authenticated'}, status=401)
    result = Sequence.delete(user['user_id'], sequence_id)
    return Response({'success': result.deleted_count > 0})

@api_view(['GET'])
def get_contacts(request):
    user = get_current_user(request)
    if not user:
        return Response({'contacts': []}, status=200)
    contacts = Contact.get_all(user['user_id'])
    contact_list = [{'contact_id': str(c.get('contact_id')), 'name': c.get('name', ''), 'phone': c.get('phone', '')} for c in contacts]
    return Response({'contacts': contact_list})

@api_view(['POST'])
def create_contact(request):
    user = get_current_user(request)
    if not user:
        return Response({'error': 'Not authenticated'}, status=401)
    result = Contact.create(user['user_id'], request.data)
    return Response({'success': True, 'contact_id': str(result.inserted_id)}, status=201)

@api_view(['GET'])
def get_dashboard_stats(request):
    user = get_current_user(request)
    if not user:
        return Response({'total_templates': 0, 'total_sequences': 0, 'total_contacts': 0})
    return Response({
        'total_templates': len(MessageTemplate.get_all(user['user_id'])),
        'total_sequences': len(Sequence.get_all(user['user_id'])),
        'total_contacts': len(Contact.get_all(user['user_id']))
    })

@api_view(['GET'])
def get_subcategories(request, industry):
    subcategories = {
        'Technology': ['SaaS', 'Hardware', 'IT Services', 'Cybersecurity', 'AI/ML'],
        'Marketing & Advertising': ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing'],
        'Retail': ['E-commerce', 'Fashion', 'Grocery', 'Electronics'],
        'Finance': ['Banking', 'Insurance', 'Investments', 'Fintech'],
        'Healthcare': ['Hospitals', 'Clinics', 'Pharmaceuticals', 'Telehealth'],
        'Education': ['K-12', 'Higher Education', 'Online Learning', 'Test Prep']
    }
    return Response(subcategories.get(industry, ['General']))