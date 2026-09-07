from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/workshops/', include('workshops.urls')),
    path('api/bookings/', include('bookings.urls')),
]
