# from django.urls import path
# from . import views

# urlpatterns = [
#     path('send-otp/', views.send_otp, name='send_otp'),
#     path('verify-otp/', views.verify_otp, name='verify_otp'),
#     path('onboarding/', views.save_onboarding, name='save_onboarding'),
#     path('onboarding/<str:user_id>/', views.get_onboarding, name='get_onboarding'),
#     path('templates/', views.get_templates, name='get_templates'),
#     path('templates/create/', views.create_template, name='create_template'),
#     path('templates/<str:template_id>/delete/', views.delete_template, name='delete_template'),
#     path('sequences/', views.get_sequences, name='get_sequences'),
#     path('sequences/create/', views.create_sequence, name='create_sequence'),
#     path('sequences/<str:sequence_id>/delete/', views.delete_sequence, name='delete_sequence'),
#     path('sequences/<str:sequence_id>/status/<str:status_val>/', views.update_sequence_status, name='update_sequence_status'),
#     path('integration/<str:user_id>/', views.get_integration_status, name='get_integration_status'),
#     path('integration/<str:user_id>/update/', views.update_integration_status, name='update_integration_status'),
#     path('send-whatsapp/', views.send_whatsapp_message, name='send_whatsapp'),
#     path('send-bulk-whatsapp/', views.send_bulk_whatsapp, name='send_bulk_whatsapp'),
#     path('contacts/', views.get_contacts, name='get_contacts'),
#     path('contacts/create/', views.create_contact, name='create_contact'),
#     path('contacts/<str:contact_id>/delete/', views.delete_contact, name='delete_contact'),
#     path('auto-replies/', views.get_auto_replies, name='get_auto_replies'),
#     path('auto-replies/create/', views.create_auto_reply, name='create_auto_reply'),
#     path('auto-replies/<str:reply_id>/delete/', views.delete_auto_reply, name='delete_auto_reply'),
#     path('auto-reply/check/', views.check_auto_reply, name='check_auto_reply'),
#     path('faqs/', views.get_faqs, name='get_faqs'),
#     path('faqs/create/', views.create_faq, name='create_faq'),
#     path('faqs/<str:faq_id>/delete/', views.delete_faq, name='delete_faq'),
#     path('subcategories/<str:industry>/', views.get_subcategories, name='get_subcategories'),
#     path('dashboard/stats/', views.get_dashboard_stats, name='dashboard_stats'),
#     # Add this to urlpatterns
#     path('onboarding-current/', views.get_current_user_onboarding, name='get_current_user_onboarding'),
# ]




from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('signup/', views.signup, name='signup'),
    path('send-login-otp/', views.send_login_otp, name='send_login_otp'),
    path('verify-login-otp/', views.verify_login_otp, name='verify_login_otp'),
    path('logout/', views.logout, name='logout'),
    
    # Onboarding
    path('send-otp/', views.send_otp, name='send_otp'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('complete-onboarding/', views.complete_onboarding, name='complete_onboarding'),
    path('onboarding-status/', views.get_onboarding_status, name='onboarding_status'),
    
    # Templates
    path('templates/', views.get_templates, name='get_templates'),
    path('templates/create/', views.create_template, name='create_template'),
    path('templates/<str:template_id>/delete/', views.delete_template, name='delete_template'),
    
    # Sequences
    path('sequences/', views.get_sequences, name='get_sequences'),
    path('sequences/create/', views.create_sequence, name='create_sequence'),
    path('sequences/<str:sequence_id>/delete/', views.delete_sequence, name='delete_sequence'),
    
    # Contacts
    path('contacts/', views.get_contacts, name='get_contacts'),
    path('contacts/create/', views.create_contact, name='create_contact'),
    
    # Other
    path('dashboard/stats/', views.get_dashboard_stats, name='dashboard_stats'),
    path('subcategories/<str:industry>/', views.get_subcategories, name='get_subcategories'),
]