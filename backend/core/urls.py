from django.urls import path
from .views import analyze_ui_view

urlpatterns = [
    path("api/analyze-ui/", analyze_ui_view, name="analyze-ui"),
]
