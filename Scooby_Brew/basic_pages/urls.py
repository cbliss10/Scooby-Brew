from django.urls import path
from basic_pages import views

app_name = 'basic_pages'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('user_login/', views.user_login, name='user_login'),
]