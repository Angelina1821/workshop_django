from django.urls import path

from .views import BookingCreateView, BookingListView, BookingCancelView

urlpatterns = [
    path('create/', BookingCreateView.as_view(), name='booking-create'),
    path('', BookingListView.as_view(), name='booking-list'),
    path('<int:pk>/', BookingCancelView.as_view(), name='booking-cancel'),
]