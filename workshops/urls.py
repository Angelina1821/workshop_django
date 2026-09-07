from django.urls import path

from .views import WorkshopCreateView, WorkshopListView, WorkshopDetailView

urlpatterns = [
    path('', WorkshopListView.as_view(), name='workshop-list'),
    path('create/', WorkshopCreateView.as_view(), name='workshop-create'),
    path('<int:pk>/', WorkshopDetailView.as_view(), name='workshop-detail'),
]