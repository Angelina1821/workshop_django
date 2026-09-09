from django.urls import path

from .views import WorkshopCreateView, WorkshopListView, WorkshopDetailView, ClassroomCreateView, ClassroomListView

urlpatterns = [
    path('', WorkshopListView.as_view(), name='workshop-list'),
    path('create/', WorkshopCreateView.as_view(), name='workshop-create'),
    path('<int:pk>/', WorkshopDetailView.as_view(), name='workshop-detail'),
    path('createclass/', ClassroomCreateView.as_view(), name='class-create'),
    path('classrooms/', ClassroomListView.as_view(), name='class-list'),
]