from django.contrib import admin
from django.contrib.auth.models import User, Group

admin.site.site_header = "WhatsApp CRM Admin"
admin.site.site_title = "WhatsApp CRM"
admin.site.index_title = "Dashboard"

try:
    if not admin.site.is_registered(User):
        admin.site.register(User)
    if not admin.site.is_registered(Group):
        admin.site.register(Group)
except:
    pass