from django.urls import path, include

app_name = 'tickets'

urlpatterns = [
    path('api/v1/', include('tickets.api.v1.urls')),
]
