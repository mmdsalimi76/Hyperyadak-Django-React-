from rest_framework import serializers
from ...models import Ticket, TicketMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class TicketMessageSerializer(serializers.ModelSerializer):
    sender_phone = serializers.CharField(source='sender.phone_number', read_only=True)
    sender_name = serializers.SerializerMethodField()
    is_support = serializers.BooleanField(source='sender.is_staff', read_only=True)

    class Meta:
        model = TicketMessage
        fields = ['id', 'sender_phone', 'sender_name', 'message', 'is_support', 'created_date']
        read_only_fields = ['id', 'created_date']

    def get_sender_name(self, obj):
        try:
            profile = obj.sender.profile
            if profile.first_name or profile.last_name:
                return f"{profile.first_name} {profile.last_name}".strip()
        except AttributeError:
            pass
        return "پشتیبانی" if obj.sender.is_staff else "کاربر"


class TicketListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'status', 'status_display', 'created_date', 'updated_date']
        read_only_fields = ['id', 'status', 'created_date', 'updated_date']


class TicketDetailSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    messages = TicketMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'status', 'status_display', 'created_date', 'updated_date', 'messages']
        read_only_fields = ['id', 'status', 'created_date', 'updated_date', 'messages']


class TicketCreateSerializer(serializers.ModelSerializer):
    message = serializers.CharField(write_only=True, required=True, error_messages={'required': 'متن پیام الزامی است'})

    class Meta:
        model = Ticket
        fields = ['id', 'title', 'message', 'created_date']
        read_only_fields = ['id', 'created_date']
        extra_kwargs = {
            'title': {'error_messages': {'required': 'عنوان تیکت الزامی است'}}
        }

    def create(self, validated_data):
        message_text = validated_data.pop('message')
        user = self.context['request'].user
        
        ticket = Ticket.objects.create(user=user, **validated_data)
        TicketMessage.objects.create(ticket=ticket, sender=user, message=message_text)
        return ticket
