from django.urls import path
from . import views

app_name = 'api-v1'

urlpatterns = [
    path('', views.TicketListCreateAPIView.as_view(), name='ticket-list-create'),
    path('<int:pk>/', views.TicketDetailAPIView.as_view(), name='ticket-detail'),
    path('<int:pk>/reply/', views.TicketReplyAPIView.as_view(), name='ticket-reply'),
]
