from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ...models import Ticket, TicketMessage
from .serializers import (
    TicketListSerializer,
    TicketDetailSerializer,
    TicketCreateSerializer,
    TicketMessageSerializer
)

class TicketListCreateAPIView(generics.ListCreateAPIView):
    """
    List user's tickets or create a new one.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user).order_by('-updated_date')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TicketCreateSerializer
        return TicketListSerializer


class TicketDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve details of a specific ticket along with its messages.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TicketDetailSerializer

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)


class TicketReplyAPIView(APIView):
    """
    Reply to an existing ticket.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk, user=request.user)
        
        if ticket.status == 'closed':
            return Response(
                {'detail': 'این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        message_text = request.data.get('message')
        if not message_text or not message_text.strip():
            return Response(
                {'message': ['متن پیام نمی‌تواند خالی باشد.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create message
        msg = TicketMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            message=message_text.strip()
        )
        
        # Update ticket status back to open (waiting for support response)
        ticket.status = 'open'
        ticket.save()
        
        serializer = TicketMessageSerializer(msg)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
