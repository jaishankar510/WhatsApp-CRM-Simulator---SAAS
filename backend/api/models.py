


import pymongo
from pymongo import MongoClient
import uuid
from datetime import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client['whatsapp_crm']

# Collections
users_collection = db['users']
onboarding_collection = db['onboarding_data']
templates_collection = db['message_templates']
sequences_collection = db['sequences']
contacts_collection = db['contacts']
integration_collection = db['integration_status']

# Indexes
users_collection.create_index('email', unique=True)
users_collection.create_index('user_id', unique=True)
onboarding_collection.create_index('user_id', unique=True)
templates_collection.create_index([('user_id', 1), ('template_id', 1)], unique=True)
sequences_collection.create_index([('user_id', 1), ('sequence_id', 1)], unique=True)
contacts_collection.create_index([('user_id', 1), ('phone', 1)], unique=True)

class User:
    @staticmethod
    def create(email, name):
        user_id = str(uuid.uuid4())
        users_collection.insert_one({
            'user_id': user_id,
            'email': email,
            'name': name,
            'status': 'pending',  # pending onboarding
            'created_at': datetime.now()
        })
        return user_id
    
    @staticmethod
    def get_by_email(email):
        return users_collection.find_one({'email': email})
    
    @staticmethod
    def get_by_user_id(user_id):
        return users_collection.find_one({'user_id': user_id})
    
    @staticmethod
    def update_status(user_id, status):
        users_collection.update_one({'user_id': user_id}, {'$set': {'status': status}})

class OnboardingData:
    @staticmethod
    def create(user_id, data):
        data['user_id'] = user_id
        data['created_at'] = datetime.now()
        data['updated_at'] = datetime.now()
        return onboarding_collection.insert_one(data)
    
    @staticmethod
    def get(user_id):
        return onboarding_collection.find_one({'user_id': user_id})

class MessageTemplate:
    @staticmethod
    def create(user_id, data):
        data['user_id'] = user_id
        data['template_id'] = str(uuid.uuid4())
        data['created_at'] = datetime.now()
        return templates_collection.insert_one(data)
    
    @staticmethod
    def get_all(user_id):
        return list(templates_collection.find({'user_id': user_id}).sort('created_at', -1))
    
    @staticmethod
    def delete(user_id, template_id):
        return templates_collection.delete_one({'user_id': user_id, 'template_id': template_id})

class Sequence:
    @staticmethod
    def create(user_id, data):
        data['user_id'] = user_id
        data['sequence_id'] = str(uuid.uuid4())
        data['created_at'] = datetime.now()
        data['active'] = False
        data['status'] = 'draft'
        return sequences_collection.insert_one(data)
    
    @staticmethod
    def get_all(user_id):
        return list(sequences_collection.find({'user_id': user_id}).sort('created_at', -1))
    
    @staticmethod
    def delete(user_id, sequence_id):
        return sequences_collection.delete_one({'user_id': user_id, 'sequence_id': sequence_id})

class Contact:
    @staticmethod
    def create(user_id, data):
        data['user_id'] = user_id
        data['contact_id'] = str(uuid.uuid4())
        data['created_at'] = datetime.now()
        return contacts_collection.insert_one(data)
    
    @staticmethod
    def get_all(user_id):
        return list(contacts_collection.find({'user_id': user_id}).sort('created_at', -1))
    
    @staticmethod
    def delete(user_id, contact_id):
        return contacts_collection.delete_one({'user_id': user_id, 'contact_id': contact_id})

class IntegrationStatus:
    @staticmethod
    def get_or_create(user_id):
        doc = integration_collection.find_one({'user_id': user_id})
        if not doc:
            doc = {'user_id': user_id, 'status': 'pending', 'messaging_tier': 'standard'}
            integration_collection.insert_one(doc)
        return doc