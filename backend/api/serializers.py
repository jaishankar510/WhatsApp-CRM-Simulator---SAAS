


from rest_framework import serializers
from .models import OnboardingData, MessageTemplate, Sequence, IntegrationStatus

class OnboardingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnboardingData
        fields = '__all__'

class MessageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageTemplate
        fields = '__all__'

class SequenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sequence
        fields = '__all__'

class IntegrationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegrationStatus
        fields = '__all__'